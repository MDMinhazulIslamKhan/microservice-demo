import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an Express request handler function with error handling to catch asynchronous errors.
 * If an error occurs during the execution of the wrapped function, it forwards the error to the Express error-handling middleware.
 *
 * @param fn The Express request handler function to be wrapped (required).
 * @returns A new request handler function with error handling.
 */
const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchAsync;
