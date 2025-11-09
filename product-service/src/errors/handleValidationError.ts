import mongoose from 'mongoose';
import {
  IGenericErrorMessages,
  IGenericErrorResponse,
} from '../interfaces/common';

/**
 * Handles validation errors that occur during MongoDB operations.
 * @param err The validation error object.
 * @returns An object containing the status code, error message, and error details.
 */
const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessages[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation error',
    errorMessages: errors,
  };
};

export default handleValidationError;
