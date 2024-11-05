import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';

const dbQueryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.dbQuery = async (
    query: string,
    param: (string | number)[],
    errorMessage = 'DB Query Error',
    errorCode = 500,
    errorAlert = true,
  ) => {
    try {
      const result = (await req.db.execute(query, param)) ?? [[], []];
      if (!Array.isArray(result)) throw new Error();

      return result;
    } catch (err) {
      if (errorMessage || errorCode) {
        next(new CustomError(errorMessage, errorCode, errorAlert));
      } else {
        next(err);
      }
      return [[], []];
    }
  };

  next();
};

export default dbQueryMiddleware;
