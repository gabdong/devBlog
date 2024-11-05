import express, { Request, Response } from 'express';
import md5 from 'md5';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import token from '@utils/jwt';
import { getDbResult } from '@utils/utils';

const router = express.Router();

router.post(
  '/login',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { id, pw } = req.body;

    //TODO 비밀번호 암호화
    const userRes = await req.dbQuery(
      'SELECT idx, auth, id, name, phone, birth, email FROM members WHERE id=? AND password=?',
      [id, pw],
      '회원정보 조회를 실패하였습니다',
      500,
    );

    if (userRes[0].length == 0)
      throw new CustomError('회원정보가 없습니다.', 401);

    const userData = getDbResult(userRes);
    const userIdx = userData.idx;

    //* jwt 발급
    const refreshToken = token.refresh(userIdx);

    const tokenRes = await req.dbQuery(
      'SELECT hash_idx AS hashIdx FROM tokens WHERE member=?',
      [userIdx],
      '토큰 조회를 실패하였습니다.',
      500,
    );

    let tokenHashIdx = '';
    if (tokenRes[0].length == 0) {
      const insertTokenRes = await req.dbQuery(
        'INSERT INTO tokens SET refresh_token=?, member=?',
        [refreshToken, userIdx],
        '갱신토큰 저장을 실패하였습니다.',
        500,
      );
      const insertTokenData = insertTokenRes[0];
      const { insertId: insertTokenId } = insertTokenData;
      tokenHashIdx = md5(
        `${process.env.REFRESH_TOKEN_HASH_IDX_KEY}${insertTokenId}`,
      );

      await req.dbQuery(
        'UPDATE tokens SET hash_idx=? WHERE idx=?',
        [tokenHashIdx, insertTokenId],
        '갱신토큰 암호키 업데이트를 실패하였습니다',
        500,
      );
    } else {
      tokenHashIdx = getDbResult(tokenRes).hashIdx;
      await req.dbQuery(
        'UPDATE tokens SET refresh_token=? WHERE hash_idx=?',
        [refreshToken, tokenHashIdx],
        '갱신토큰 업데이트를 실패하였습니다',
        500,
      );
    }

    res.cookie('refreshTokenIdx', tokenHashIdx, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.json({ userData });
  }),
);

router.get(
  '/check-token',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { refreshTokenIdx } = req.body;

    if (!refreshTokenIdx) throw new CustomError('권한이 없습니다.', 401, false);

    const refreshTokenRes = await req.dbQuery(
      'SELECT refresh_token AS refreshToken FROM tokens WHERE hash_idx=?',
      [refreshTokenIdx],
      '토큰조회를 실패하였습니다',
      500,
    );
    const { refreshToken } = getDbResult(
      refreshTokenRes,
      '권한이 없습니다',
      401,
      false,
    );

    console.log(refreshToken);
    res.json({ test: 'test' });
  }),
);

export default router;
