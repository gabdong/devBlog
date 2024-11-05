import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomError } from './customError';

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET)
  throw new CustomError('로그인 키가 설정되어 있지 않습니다', 500);

if (!process.env.REFRESH_TOKEN_SECRET)
  throw new CustomError('로그인 갱신키가 설정되어 있지 않습니다', 500);

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const token = {
  access: (idx: number): string => {
    return jwt.sign({ idx }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  },
  refresh: (idx: number): string => {
    return jwt.sign({ idx }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  },
  check: (token: string, mode = 'access') => {
    const secretKey =
      mode == 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    const result = jwt.verify(token, secretKey, (err, decodedData) => {
      if (err) return false;
      return decodedData;
    });

    return result;
  },
};

export default token;
