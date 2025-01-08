import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'lib/utils/customError';

/**
 * * express error handling
 */
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

  console.log(err);
  res.status(statusCode).json({ message });
};

/**
 * * async function error handling
 */
export const asyncErrorHandler = (
  callback: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
};
