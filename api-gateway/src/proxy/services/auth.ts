import { Request, Router } from 'express';
import config from '../../config';
import { authLimiter } from '../../middleware/rateLimiter';
import validateRequest from '../../middleware/validate';
import { AuthValidation } from '../../schemas/auth';
import { buildProxyMiddleware } from '../proxy';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../enum';

const router = Router();

const defaultProxy = buildProxyMiddleware({
  url: config.serviceRoutes.authService,
  name: 'auth-service-default',
  pathRewrite: (path: string, req: Request) => {
    const original = (req.originalUrl || req.url || path) as string;
    return original.replace('/api/auth/', '/api/v1/');
  },
});

const authModuleProxy = buildProxyMiddleware({
  url: config.serviceRoutes.authService,
  name: 'auth-service-module',
  pathRewrite: { '^': '/api/v1/auth' },
});

router.use('/admin', auth(ENUM_USER_ROLE.ADMIN), defaultProxy);

router.use('/user', auth(), defaultProxy);

router.post(
  '/registration',
  authLimiter,
  validateRequest(AuthValidation.registrationUserZodSchema),
  authModuleProxy
);

router.post(
  '/login',
  authLimiter,
  validateRequest(AuthValidation.loginUserZodSchema),
  authModuleProxy
);

router.post('/refresh-token', authModuleProxy);

router.use(defaultProxy);

export const AuthProxy = router;
