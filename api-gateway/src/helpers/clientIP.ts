import { Request } from 'express';

/**
 * Extracts the client's IP address from the request headers or socket.
 * Handles proxies and load balancers that set 'x-forwarded-for'.
 *
 * @param req - Express Request object
 * @returns Client IP address as a string
 */
const getClientIp = (req: Request): string | undefined => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    return Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(',')[0].trim(); // Handles comma-separated values
  }

  return req.socket?.remoteAddress;
};

export default getClientIp;
