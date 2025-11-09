/**
 * Custom error class for handling API errors.
 */
class ApiError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number;

  /**
   * Creates an instance of ApiError.
   * @param statusCode The HTTP status code of the error (required).
   * @param message The error message (required).
   * @param stack The stack trace of the error (optional).
   */
  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
