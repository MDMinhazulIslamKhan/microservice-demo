import mongoose from 'mongoose';
import { IGenericErrorMessages } from '../interfaces/common';

/**
 * Handles cast errors that occur during MongoDB operations.
 * @param error The cast error object.
 * @returns An object containing the status code, error message, and error details.
 */
const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessages[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];
  return {
    statusCode: 400,
    message: 'Cast error',
    errorMessages: errors,
  };
};

export default handleCastError;
