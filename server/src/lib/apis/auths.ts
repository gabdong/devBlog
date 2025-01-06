import express from 'express';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import token from '@utils/jwt';
import {
  buildErrorMessage,
  getCookieValue,
  getCurrentLine,
  getDbResult,
} from '@utils/utils';

const CURRENT_FILE = 'AUTH';
const router = express.Router();

//- 로그인
router.post(
  '/login',
  asyncErrorHandler(async (req, res) => {
    const { id, pw } = req.body;

    if (!id || !pw)
      throw new CustomError(
        buildErrorMessage(
          '아이디 또는 비밀번호를 입력해주세요.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        400,
      );

    const userRes = await req.dbQuery(
      'SELECT idx, auth, id, name, phone, birth, email FROM members WHERE id=? AND password=UPPER(SHA1(UNHEX(SHA1(?))))',
      [id, pw],
      buildErrorMessage(
        '회원정보 조회를 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    if (userRes[0].length == 0)
      throw new CustomError(
        buildErrorMessage(
          '회원정보가 존재하지 않습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        401,
      );

    const userData = getDbResult(userRes);
    const userIdx = userData.idx;

    //* jwt 발급
    const accessToken = token.access(userIdx);
    const refreshToken = token.refresh(userIdx);

    const tokenRes = await req.dbQuery(
      'SELECT hash_idx AS hashIdx FROM tokens WHERE member=?',
      [userIdx],
    );

    //* refreshToken 저장
    let tokenHashIdx = '';
    if (tokenRes[0].length === 0) {
      const insertTokenRes = await req.dbQuery(
        'INSERT INTO tokens SET refresh_token=?, member=?, hash_idx=MD5(CONCAT(?, ?))',
        [
          refreshToken,
          userIdx,
          process.env.REFRESH_TOKEN_HASH_IDX_KEY,
          userIdx,
        ],
        buildErrorMessage(
          '갱신토큰 저장을 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const insertTokenData = insertTokenRes[0];
      const { insertId: insertTokenId } = insertTokenData;

      const newTokenHashIdxRes = await req.dbQuery(
        'SELECT hash_idx AS hashIdx FROM tokens WHERE idx=?',
        [insertTokenId],
        buildErrorMessage(
          '토큰 해쉬값 조회를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      tokenHashIdx = getDbResult(newTokenHashIdxRes).hashIdx;
    } else {
      tokenHashIdx = getDbResult(tokenRes).hashIdx;
      await req.dbQuery(
        'UPDATE tokens SET refresh_token=? WHERE hash_idx=?',
        [refreshToken, tokenHashIdx],
        buildErrorMessage(
          '갱신토큰 업데이트를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
    }
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15, // 15분
      httpOnly: true,
      sameSite: 'strict',
      secure: false, //TODO product 배포시 true로 변경
      path: '/',
    });
    res.cookie('refreshTokenHashIdx', tokenHashIdx, {
      maxAge: 1000 * 60 * 60 * 24, // 1일
      httpOnly: true,
      sameSite: 'strict',
      secure: false, //TODO product 배포시 true로 변경
      path: '/',
    });

    res.json({ userData });
  }),
);

//- jwt 유효성 확인
router.get(
  '/check-token',
  asyncErrorHandler(async (req, res) => {
    let newAccessToken = '',
      newRefreshToken = '',
      newRefreshTokenHashIdx = '',
      userIdx = 0;

    const accessToken = getCookieValue('accessToken', req.headers.cookie);
    const refreshTokenHashIdx = getCookieValue(
      'refreshTokenHashIdx',
      req.headers.cookie,
    );

    //* 비로그인
    if (!accessToken && !refreshTokenHashIdx) {
      res.json({});
      return;
    }

    //* accessToken 검증
    const checkAccessToken =
      typeof accessToken === 'string' && token.check(accessToken, 'access');

    if (checkAccessToken) userIdx = checkAccessToken.userIdx;

    // accessToken이 유효하지 않은데 갱신토큰이 없는경우
    if (typeof refreshTokenHashIdx !== 'string' && !checkAccessToken)
      throw new CustomError(
        buildErrorMessage(
          '유효하지 않은 토큰입니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        401,
      );

    //* accessToken이 유효하지 않은경우 refreshToken 검증
    if (!userIdx) {
      const refreshTokenRes = await req.dbQuery(
        'SELECT refresh_token AS refreshToken FROM tokens WHERE hash_idx=?',
        [refreshTokenHashIdx],
        buildErrorMessage(
          '갱신토큰 조회를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );

      const { refreshToken } = getDbResult(
        refreshTokenRes,
        buildErrorMessage(
          '갱신토큰 정보가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        404,
      );

      const checkRefreshToken = token.check(refreshToken, 'refresh');
      if (!checkRefreshToken)
        throw new CustomError(
          buildErrorMessage(
            '유효하지 않은 토큰입니다.',
            CURRENT_FILE,
            getCurrentLine(),
          ),
          401,
        );

      userIdx = checkRefreshToken.userIdx;
    }

    /**
     * accessToken과 refreshToken을 모두 검증했기 때문에
     * 현시점 userIdx 없는경우 throw error
     */
    if (!userIdx) throw new CustomError('유효하지 않은 토큰입니다.', 401);

    //* 회원정보 조회
    const userDataRes = await req.dbQuery(
      'SELECT idx, auth, birth, datetime, email, id, name, phone, update_datetime AS updateDatetime FROM members WHERE idx=?',
      [userIdx],
      buildErrorMessage(
        '회원정보 조회를 실패하였습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    const userData = (<unknown>(
      getDbResult(
        userDataRes,
        buildErrorMessage(
          '회원정보가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        404,
      )
    )) as UserState;
    userData.isLogin = true;

    //* 새로운 토큰 발급
    newRefreshToken = token.refresh(userIdx);
    newAccessToken = token.access(userIdx);

    const refreshTokenIdxRes = await req.dbQuery(
      'SELECT idx, hash_idx AS refreshTokenHashIdx FROM tokens WHERE member=?',
      [userIdx],
    );
    const { idx: refreshTokenIdx, refreshTokenHashIdx: dbRefreshTokenHashIdx } =
      getDbResult(refreshTokenIdxRes);

    //* 갱신토큰정보 DB 적용
    if (!refreshTokenIdx) {
      // 갱신토큰 정보 없는경우 insert
      const insertTokenRes = await req.dbQuery(
        'INSERT INTO tokens SET refresh_token=?, member=?, hash_idx=MD5(CONCAT(?, ?))',
        [
          newRefreshToken,
          userIdx,
          process.env.REFRESH_TOKEN_HASH_IDX_KEY,
          userIdx,
        ],
        buildErrorMessage(
          '갱신토큰 저장을 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const insertTokenData = insertTokenRes[0];
      const { insertId: insertTokenId } = insertTokenData;
      const newTokenHashIdxRes = await req.dbQuery(
        'SELECT hash_idx AS hashIdx FROM tokens WHERE idx=?',
        [insertTokenId],
        buildErrorMessage(
          '토큰 해쉬값 조회를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      newRefreshTokenHashIdx = getDbResult(newTokenHashIdxRes).hashIdx;
    } else {
      // 기존 갱신토큰 정보 있는경우 update
      await req.dbQuery(
        'UPDATE tokens SET refresh_token=? WHERE idx=?',
        [newRefreshToken, refreshTokenIdx],
        buildErrorMessage(
          '갱신토큰 업데이트를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );

      newRefreshTokenHashIdx = dbRefreshTokenHashIdx;
    }

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15, // 15분
      httpOnly: true,
      sameSite: 'strict',
      secure: false, //TODO product 배포시 true로 변경
      path: '/',
    });
    res.cookie('refreshTokenHashIdx', newRefreshTokenHashIdx, {
      maxAge: 1000 * 60 * 60 * 24, // 1일
      httpOnly: true,
      sameSite: 'strict',
      secure: false, //TODO product 배포시 true로 변경
      path: '/',
    });

    res.json({
      userData,
      refreshTokenHashIdx: newRefreshTokenHashIdx,
      accessToken: newAccessToken,
    });
  }),
);

//- 로그아웃
router.delete(
  '/',
  asyncErrorHandler(async (req, res) => {
    const refreshTokenHashIdx = getCookieValue(
      'refreshTokenHashIdx',
      req.headers.cookie,
    );
    const accessToken = getCookieValue('accessToken', req.headers.cookie);

    if (!refreshTokenHashIdx && !accessToken) {
      throw new CustomError(
        buildErrorMessage(
          '이미 로그아웃 되었습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        400,
      );
    }

    await req.dbQuery(
      'DELETE FROM tokens WHERE hash_idx=?',
      [refreshTokenHashIdx],
      buildErrorMessage(
        '갱신토큰 제거를 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    res.clearCookie('accessToken');
    res.clearCookie('refreshTokenHashIdx');
    res.json({});
  }),
);

export default router;
