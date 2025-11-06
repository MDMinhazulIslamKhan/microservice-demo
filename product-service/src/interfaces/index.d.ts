/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UserInfoFromToken } from './common';

declare global {
  namespace Express {
    interface Request {
      user: UserInfoFromToken | null;
      id: string | null;
      correlationId: string | null;
    }
  }
}
