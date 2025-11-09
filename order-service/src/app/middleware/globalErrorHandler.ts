import { ErrorRequestHandler } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { ZodError } from 'zod';
import handleZodError from '../../errors/handleZodError';
import { errorLogger } from '../../utils/logger';
import { IGenericErrorMessages } from '../../interfaces/common';
import { Prisma } from '@prisma/client';

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
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      message = 'Duplicate Key error';

      const model = error.meta?.modelName as string | undefined;
      const target = error.meta?.target as string[] | undefined;

      statusCode = 409;
      errorMessages = [
        {
          path: target?.join('.') || '',
          message: `The value for ${target?.join(
            ', '
          )} is already taken for ${model}.`,
        },
      ];
    } else if (error.code === 'P2023') {
      message = 'Invalid ID';

      statusCode = 400;
      errorMessages = [
        {
          path: '',
          message: 'Invalid id',
        },
      ];
    } else if (error.code === 'P2025') {
      message = 'No record was found';

      const model = error.meta?.modelName as string;

      statusCode = 404;
      errorMessages = [
        {
          path: model,
          message: `No record was found in this ${model}`,
        },
      ];
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    message = 'Validation Error, Invalid request';
    statusCode = 400;
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
