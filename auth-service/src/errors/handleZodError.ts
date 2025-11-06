import { ZodError } from 'zod';
import {
  IGenericErrorMessages,
  IGenericErrorResponse,
} from '../interfaces/common';

/**
 * Handles Zod validation errors that occur during schema validation.
 * @param error The Zod validation error object.
 * @returns An object containing the status code, error message, and error details.
 */
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const statusCode = 400;
  const errors: IGenericErrorMessages[] = error.issues.map(issue => {
    return {
      path: issue?.path[issue.path.length - 1].toString(),
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message: 'Validation error',
    errorMessages: errors,
  };
};

export default handleZodError;
