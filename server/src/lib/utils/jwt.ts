import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { CustomError } from '@utils/customError';

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET)
  throw new CustomError('로그인 키가 설정되어 있지 않습니다', 500);

if (!process.env.REFRESH_TOKEN_SECRET)
  throw new CustomError('로그인 갱신키가 설정되어 있지 않습니다', 500);

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const token = {
  /**
   * access token 발급
   */
  access: (userIdx: number): string => {
    return jwt.sign({ userIdx }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  },
  /**
   * refresh token 발급
   */
  refresh: (userIdx: number): string => {
    return jwt.sign({ userIdx }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  },
  /**
   * 토큰 검증
   */
  check: (token?: string, mode = 'access'): CheckTokenType => {
    if (!token) return false;

    const secretKey =
      mode == 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    const result = jwt.verify(token, secretKey, (err, decodedData) => {
      if (err) return false;
      return decodedData;
    }) as CheckTokenType;

    return result;
  },
};

export default token;
