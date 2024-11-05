import { FieldPacket, QueryResult } from 'mysql2';

import { CustomError } from '@utils/customError';

/**
 * * 쿼리결과 첫번째값을 리턴하는 함수
 * @param res - 쿼리 결과값
 * @param message - 결과 없을경우 에러메세지
 * @param statusCode - 결과 없을경우 에러코드
 * @returns 쿼리결과 첫번째값
 */
export const getDbResult = (
  res: [QueryResult, FieldPacket[]],
  message?: string,
  statusCode = 500,
  errorAlert = true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  if (Array.isArray(res[0])) {
    // 쿼리 결과가 없을경우 에러메세지가 있으면 throw error
    if (res[0].length === 0) {
      if (message) throw new CustomError(message, statusCode, errorAlert);
      return null;
    }
    return res[0][0];
  }
};

/**
 * * 쿼리결과 배열 리턴하는 함수
 * @param res - 쿼리 결과값
 * @returns 쿼리 결과 배열
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDbResultArr = (res: [QueryResult, FieldPacket[]]): any => {
  if (Array.isArray(res[0])) return res[0];
};