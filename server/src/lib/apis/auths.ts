import { asyncErrorHandler } from '@middlewares/errorHandler';
import express, { NextFunction, Request, Response } from 'express';
import { CustomError } from 'lib/utils/customError';
const router = express.Router();

router.post(
  '/login',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, pw } = req.body;

    const result = await req.dbQuery(
      'SELECT * FROM members WHERE id=? AND password=?',
      [id, pw],
      '회원정보 조회를 실패하였습니다',
      500,
    );

    if (Array.isArray(result) && result[0].length == 0) {
      throw new CustomError('회원정보가 없습니다.', 404);
    }

    res.json({ userData: Array.isArray(result) && result[0][0] });
  }),
);

export default router;
