import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const reqId = (req: Request, res: Response, next: NextFunction) => {
  const rid = req.headers['x-req-id']?.toString() || randomUUID();

  req.id = rid;
  res.setHeader('X-Req-Id', rid);

  next();
};
