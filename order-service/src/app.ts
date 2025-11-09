import express, { Application, Request, Response } from 'express';
import { ApplicationRouters } from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';

const app: Application = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// testing
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to microservice demo order service.',
  });
});

// Routes
app.use('/api/v1', ApplicationRouters);

// No routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not found',
    errorMessage: {
      path: req.originalUrl,
      message: 'Api not found!!! Wrong url, there is no route in this url.',
    },
  });
});

app.use(globalErrorHandler);

export default app;
