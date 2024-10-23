import { NextFunction, Request, Response } from 'express';

import db from '@configs/db';

const dbConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const connection = await db.getConnection();
    req.db = connection;

    res.on('finish', () => {
      if (req.db) req.db.release();
    });
    next();
  } catch (err) {
    next(err);
  }
};

export default dbConnection;
