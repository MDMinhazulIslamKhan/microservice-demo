import { Response } from 'express';

/**
 * Api Response formate
 * @template T the response's main data type
 * @category Api Response return type formate
 */
export type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    count: number;
  };
  data?: T | null;
};

/**
 * Sends an API response with the provided data.
 *
 * @template T - Type of data which is send with response
 *
 * @param res The Express response object to send the response
 * @param data The data to be sent as the API response
 */
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
