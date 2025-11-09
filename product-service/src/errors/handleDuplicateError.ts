import mongoose from 'mongoose';
import { IGenericErrorMessages } from '../interfaces/common';

/**
 * Handles MongoDB duplicate key errors (e.g. unique constraint violations).
 * @param error The MongoServerError object thrown by Mongoose.
 * @returns An object containing the status code, error message, and details.
 */
const handleDuplicateError = (error: mongoose.Error.VersionError) => {
  const errors: IGenericErrorMessages[] = [
    {
      path: '',
      message: 'Duplicate key error.',
    },
  ];
  return {
    statusCode: 409,
    message: error.message,
    errorMessages: errors,
  };
};

export default handleDuplicateError;
