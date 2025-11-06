import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';

/**
 * Authentication middleware for extracting authenticated user details and checks if the user has the required roles.
 *
 * @param requiredRoles List of allowed roles (if empty, any authenticated user is allowed).
 */
const userContext =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const forwardedBy = req.headers['x-forwarded-by'];
      const rawUser = req.headers['x-user'] as string | undefined;

      if (!rawUser || forwardedBy !== 'microservice-gateway') {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      const parsedUser = JSON.parse(rawUser);
      let user = { id: parsedUser.userId, role: parsedUser.userRole };
      if (rawUser) {
        try {
          user = JSON.parse(rawUser);
        } catch {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }
      }

      req.user = user;

      // role guard
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default userContext;
