import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';

/**
 * Creates a new JWT token with the specified payload, secret, and expiration time.
 * @param payload The payload to be encoded in the token (required).
 * @param secret The secret key used to create the token (required).
 * @param expireTime The expiration time for the token in second (required).
 * @returns The JWT token string.
 */
const createToken = (
  payload: object,
  secret: Secret,
  expireTime: number
): string => {
  const options: SignOptions = {
    expiresIn: expireTime,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Verifies the authenticity of a JWT token using the specified secret.
 * @param token The JWT token to verify (required).
 * @param secret The secret key used to verify the token's signature (required).
 * @returns The decoded payload if the token is valid.
 * @throws Error if the token is invalid or has expired.
 */
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new ApiError(403, 'Invalid token');
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
