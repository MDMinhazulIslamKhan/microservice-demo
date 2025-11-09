import { UserRoles } from '../app/modules/users/user.constant';

/**
 * Every error message's description
 */
export type IGenericErrorMessages = {
  /** Error generated location */
  path: string | number;
  message: string;
};

/**
 * Error response formate
 */
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessages[];
};

/**
 * User information in jwt token
 */
export type UserInfoFromToken = {
  id: string;
  role: UserRoles;
  iat?: number;
  exp?: number;
};

/**
 * Pagination options for calculate pagination data
 */
export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
