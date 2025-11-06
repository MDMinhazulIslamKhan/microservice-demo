import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../helpers/jwtHelpers';
import ApiError from '../errors/ApiError';

/**
 * Authentication middleware that verifies the JWT token in the request headers and checks if the user has the required roles.
 * @param requiredRoles An array of string or The roles to access the route (required).
 */
const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'You are not authorized');
      }

      //get authorization token
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new ApiError(401, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.accessTokenSecret as Secret
      );

      req.user = verifiedUser;

      // role guard
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(403, 'Access denied.');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
