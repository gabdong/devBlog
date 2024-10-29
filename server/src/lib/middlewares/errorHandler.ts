import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'lib/utils/customError';

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

export const asyncErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};
