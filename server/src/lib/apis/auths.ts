import express from 'express';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import token from '@utils/jwt';
import { getCookieValue, getDbResult } from '@utils/utils';

const router = express.Router();

//* 로그인
router.post(
  '/login',
  asyncErrorHandler(async (req, res) => {
    const { id, pw } = req.body;

    //TODO 비밀번호 암호화
    const userRes = await req.dbQuery(
      'SELECT idx, auth, id, name, phone, birth, email FROM members WHERE id=? AND password=?',
      [id, pw],
      '회원정보 조회를 실패했습니다.',
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
      '토큰 조회를 실패했습니다.',
      500,
    );

    let tokenHashIdx = '';
    if (tokenRes[0].length == 0) {
      const insertTokenRes = await req.dbQuery(
        'INSERT INTO tokens SET refresh_token=?, member=?, hash_idx=MD5(CONCAT(?, ?))',
        [
          refreshToken,
          userIdx,
          process.env.REFRESH_TOKEN_HASH_IDX_KEY,
          userIdx,
        ],
        '갱신토큰 저장을 실패했습니다.',
        500,
      );
      const insertTokenData = insertTokenRes[0];
      const { insertId: insertTokenId } = insertTokenData;

      const newTokenHashIdxRes = await req.dbQuery(
        'SELECT hash_idx AS hashIdx FROM tokens WHERE idx=?',
        [insertTokenId],
        '토큰 조회를 실패했습니다.',
        500,
      );
      tokenHashIdx = getDbResult(newTokenHashIdxRes).hashIdx;
    } else {
      tokenHashIdx = getDbResult(tokenRes).hashIdx;
      await req.dbQuery(
        'UPDATE tokens SET refresh_token=? WHERE hash_idx=?',
        [refreshToken, tokenHashIdx],
        '갱신토큰 업데이트를 실패했습니다.',
        500,
      );
    }

    res.cookie('refreshTokenHashIdx', tokenHashIdx, {
      maxAge: 1000 * 60 * 10, // 10분
      httpOnly: true,
    });
    res.json({});
  }),
);

//* jwt 유효성 확인
router.get(
  '/check-token',
  asyncErrorHandler(async (req, res) => {
    let newAccessToken = '',
      newRefreshToken = '',
      userIdx = 0;

    const refreshTokenHashIdx = getCookieValue(
      'refreshTokenHashIdx',
      req.headers.cookie,
    );

    //* refreshTokenHashIdx 정보 없는경우 않은경우
    if (!refreshTokenHashIdx)
      throw new CustomError('갱신토큰 hash값이 없습니다.', 404, false);

    //* refreshTokenHashIdx와 매칭되는 정보가 없는경우
    const refreshTokenRes = await req.dbQuery(
      'SELECT refresh_token AS refreshToken FROM tokens WHERE hash_idx=?',
      [refreshTokenHashIdx],
      '토큰조회를 실패했습니다.',
      500,
    );

    const { refreshToken } = getDbResult(
      refreshTokenRes,
      '갱신토큰 정보가 없습니다.',
      404,
      false,
    );

    //* 토큰이 만료된경우
    const checkRefreshToken = token.check(refreshToken, 'refresh');
    if (!checkRefreshToken)
      throw new CustomError('만료된 토큰입니다.', 401, false);

    if (typeof checkRefreshToken === 'object' && checkRefreshToken.userIdx) {
      userIdx = checkRefreshToken.userIdx;

      //* 새로운 토큰 발급
      newAccessToken = token.access(userIdx);
      newRefreshToken = token.refresh(userIdx);
    } else {
      //* 토큰 decode값에 userIdx가 없는경우
      throw new CustomError('토큰에 맞는 회원정보가 없습니다', 404, false);
    }

    //* 회원정보가 없는경우
    const userDataRes = await req.dbQuery(
      'SELECT auth, birth, datetime, email, id, name, phone, update_datetime AS updateDatetime FROM members WHERE idx=?',
      [userIdx],
      '회원정보 조회를 실패했습니다.',
      500,
    );
    const userData = getDbResult(
      userDataRes,
      '회원정보가 없습니다.',
      404,
      false,
    );

    await req.dbQuery(
      'UPDATE tokens SET refresh_token=? WHERE member=?',
      [newRefreshToken, userIdx],
      '새로운 갱신토큰 업데이트를 실패했습니다',
      500,
      false,
    );

    userData.isLogin = true;
    res.json({ userData, accessToken: newAccessToken });
  }),
);

//* 로그아웃
router.delete(
  '/',
  asyncErrorHandler(async (req, res) => {
    const refreshTokenHashIdx = getCookieValue(
      'refreshTokenHashIdx',
      req.headers.cookie,
    );

    if (refreshTokenHashIdx) {
      await req.dbQuery(
        'DELETE FROM tokens WHERE hash_idx=?',
        [refreshTokenHashIdx],
        '갱신토큰 제거를 실패했습니다.',
        500,
      );

      res.cookie('refreshTokenHashIdx', '', {
        httpOnly: true,
      });
    }

    res.json({});
  }),
);

export default router;
