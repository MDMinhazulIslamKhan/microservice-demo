import { ErrorRequestHandler } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { ZodError } from 'zod';
import handleZodError from '../../errors/handleZodError';
import { errorLogger } from '../../utils/logger';
import { IGenericErrorMessages } from '../../interfaces/common';
import handleValidationError from '../../errors/handleValidationError';
import handleCastError from '../../errors/handleCastError';
import handleDuplicateError from '../../errors/handleDuplicateError';

/**
 * Global error handler middleware for Express applications.
 * @param error The error object (required).
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function in the request-response cycle.
 *
 */
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const requestId = req.headers['x-req-id'];

  errorLogger.error(
    `RequestId: ${requestId}, path: '${req.path}'(${req.method}), - ${error?.stack}`,
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
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (
    error.name === 'MongooseError' &&
    error?.cause?.errorResponse?.code === 11000
  ) {
    const simplifiedError = handleDuplicateError(error);
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
