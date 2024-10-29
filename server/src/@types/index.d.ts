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
      ) => Promise<readonly [QueryResult, FieldPacket[]] | undefined>;
    }
  }
}
