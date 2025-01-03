import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';

/**
 * - express db query middleware
 */
const dbQueryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.dbQuery = async (
    query: string,
    param: (string | number)[],
    errorMessage = 'DB Query Error',
    errorCode = 500,
  ) => {
    try {
      const result = (await req.db.execute(query, param)) ?? [[], []];

      return result;
    } catch (err) {
      if (errorMessage || errorCode) {
        next(new CustomError(errorMessage, errorCode));
      } else {
        next(err);
      }
      return [[], []];
    }
  };

  next();
};

export default dbQueryMiddleware;
