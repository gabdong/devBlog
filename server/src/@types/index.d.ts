import { PoolConnection } from 'mysql2/promise';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      db: PoolConnection;
      dbQuery: (
        query,
        param,
        errorMessage?: string,
        errorCode?: number,
      ) => Promise<[QueryResult, FieldPacket[]]>;
    }
  }
  type CheckTokenType =
    | boolean
    | string
    | jwt.JwtPayload
    | undefined
    | { userIdx: number; iat: number; exp: number };

  type UserState = {
    name: string;
  };
}
