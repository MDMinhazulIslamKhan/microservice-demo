import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import http from 'node:http';
import https from 'node:https';
import CircuitBreaker from 'opossum';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { errorLogger, logger } from '../utils/logger';
import { ServiceConfig } from '../interfaces/serviceConfig';
import getClientIp from '../helpers/clientIP';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

interface PatchedResponse extends Response {
  proxyReject?: (reason?: any) => void;
}

interface ServiceProxy {
  breaker: CircuitBreaker;
}

const serviceProxies = new Map<string, ServiceProxy>();

function getOrCreateProxyForService(service: ServiceConfig): ServiceProxy {
  if (!serviceProxies.has(service.name)) {
    const proxyOptions = createProxyOptions(service);
    const proxy = createProxyMiddleware(proxyOptions);

    const breakerAction = (
      req: Request,
      res: PatchedResponse
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        res.proxyReject = reject;

        res.on('finish', () => {
          delete res.proxyReject;
          resolve();
        });

        res.on('error', err => {
          delete res.proxyReject;
          reject(err);
        });

        proxy(req, res, reject);
      });
    };

    const breakerOptions: CircuitBreaker.Options = {
      timeout: config.requestTimeoutMS, // if service doesn’t reply in 5s → fail
      errorThresholdPercentage: 50, // if > 50% of requests fail → open breaker
      resetTimeout: 30000, // after 30s, allow test requests
      rollingCountTimeout: 10000, // stats window size
      rollingCountBuckets: 10, // divide window
    };
    const breaker = new CircuitBreaker(breakerAction, breakerOptions);

    breaker.fallback((req: Request, res: Response) => {
      errorLogger.error(
        `Circuit breaker fallback for ${service.name}, reqId: ${req.id}`,
        {
          label: 'CircuitBreakerFallback',
        }
      );
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'Service is temporarily unavailable',
        });
      }
    });

    breaker.on('open', () =>
      logger.warn(`Circuit opened for ${service.name}`, {
        label: 'CircuitBreaker',
      })
    );
    breaker.on('halfOpen', () =>
      logger.warn(`Circuit half-open for ${service.name}`, {
        label: 'CircuitBreaker',
      })
    );
    breaker.on('close', () =>
      logger.info(`Circuit closed for ${service.name}`, {
        label: 'CircuitBreaker',
      })
    );
    breaker.on('failure', () => {
      errorLogger.error(`Circuit failure for ${service.name}`, {
        label: 'CircuitBreaker',
      });
    });

    serviceProxies.set(service.name, { breaker });
  }
  return serviceProxies.get(service.name)!;
}

export const createProxyOptions = (service: ServiceConfig): Options => ({
  target: service.url,
  changeOrigin: true,
  xfwd: true,
  ws: false, // turn off unless you explicitly need WebSocket proxying
  secure: config.env === 'production',
  agent: new URL(service.url).protocol === 'https:' ? httpsAgent : httpAgent,
  proxyTimeout: (service.timeout ?? config.requestTimeoutMS) - 1000,
  pathRewrite: service.pathRewrite || { '^': '/api' },
  cookieDomainRewrite: '',
  cookiePathRewrite: '/',
  on: {
    proxyReq: (proxyReq, req: any) => {
      // for log
      logger.info(
        `Forwarding request to ${JSON.stringify({
          service: service.name,
          method: req.method,
          url: req.originalUrl,
          target: `${service.url}${proxyReq.path}`,
          'X-Req-Id': req.id,
          ip: getClientIp(req),
        })}`,
        { label: 'ProxyRequest' }
      );

      proxyReq.setHeader('X-Forwarded-By', 'microservice-gateway');
      proxyReq.setHeader('X-Req-Id', req.id);

      if (req.user) {
        proxyReq.setHeader('x-user', JSON.stringify(req.user));
      }

      const contentType = req.headers['content-type'] || '';

      if (
        contentType.includes('application/json') &&
        req.body &&
        Object.keys(req.body).length
      ) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    proxyRes: (proxyRes, req: any) => {
      logger.info(
        `Received response from ${JSON.stringify({
          service: service.name,
          method: req.method,
          url: req.originalUrl,
          status: proxyRes.statusCode,
          'X-Req-Id': req.id,
        })}`,
        { label: 'ProxyResponse' }
      );
    },

    error: (err, req: any, res: any) => {
      errorLogger.info(
        `Error proxying to ${JSON.stringify({
          service: service.name,
          method: req.method,
          url: req.originalUrl,
          error: err.message,
          'X-Req-Id': req.id,
        })}`,
        { label: 'ProxyError' }
      );

      if (res.proxyReject) {
        res.proxyReject(err);
        delete res.proxyReject;
      }

      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: 'Service is temporarily unavailable',
        });
      }
    },
  },
});

export function buildProxyMiddleware(service: ServiceConfig) {
  const { breaker } = getOrCreateProxyForService(service);

  return (req: Request, res: Response, next: NextFunction) => {
    breaker.fire(req, res).catch(next);
  };
}
