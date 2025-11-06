import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { generalLimiter } from './middleware/rateLimiter';
import { reqId } from './core/reqId';
import globalErrorHandler from './middleware/globalErrorHandler';
import ProxyRouter from './proxy';

const app = express();

app.use(express.json());

app.use(helmet());
app.use(generalLimiter);
app.use(cors(corsOptions));

app.use(reqId);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to microservice api gateway.',
  });
});

app.set('trust proxy', 'loopback');

app.use('/api', ProxyRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not found',
    errorMessage: {
      path: req.originalUrl,
      message: 'Wrong url, there is no route in this url.',
    },
  });
});

app.use(globalErrorHandler);

export default app;
