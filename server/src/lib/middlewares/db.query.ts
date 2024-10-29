import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';

const dbQueryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.dbQuery = async (
    query: string,
    param: (string | number)[],
    errorMessage?: string,
    errorCode?: number,
  ) => {
    try {
      const [rows, fileds] = (await req.db.execute(query, param)) ?? [[], []];

      return [rows, fileds] as const;
    } catch (err) {
      if (errorMessage || errorCode) {
        next(
          new CustomError(errorMessage ?? 'DB Query Error', errorCode ?? 500),
        );
      } else {
        next(err);
      }
    }
  };

  next();
};

export default dbQueryMiddleware;
