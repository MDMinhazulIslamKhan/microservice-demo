import { ErrorRequestHandler } from 'express';
import ApiError from '../errors/ApiError';
import config from '../config';
import { errorLogger } from '../utils/logger';
import { IGenericErrorMessages } from '../interfaces/common';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';

/**
 * Global error handler middleware for Express applications.
 * @param error The error object (required).
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function in the request-response cycle.
 *
 */
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const reqId = req.headers['x-req-id'];

  errorLogger.error(
    `ReqId: ${reqId}, path: '${req.path}'(${req.method}), - ${error}`,
    {
      label: 'GlobalError',
    }
  );

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessages[] = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
  next();
};

export default globalErrorHandler;
