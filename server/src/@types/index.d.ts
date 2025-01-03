import { PoolConnection } from 'mysql2/promise';

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
  //- Jwt token 검증 return type
  type CheckTokenType = false | { userIdx: number; iat: number; exp: number };

  //- User data type
  interface UserState {
    name: string;
    isLogin?: boolean;
    auth: number;
    birth: string;
    datetime: string;
    id: string;
    phone: string;
    updateDatetime: string;
    email: string;
  }
}
