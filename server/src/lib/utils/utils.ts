import { FieldPacket, QueryResult } from 'mysql2';

import { CustomError } from '@utils/customError';

/**
 * - 쿼리결과 첫번째값을 리턴하는 함수
 * @param res - 쿼리 결과값
 * @param message - 결과 없을경우 에러메세지
 * @param statusCode - 결과 없을경우 에러코드
 * @returns 쿼리결과 첫번째값
 */
export const getDbResult = (
  res: [QueryResult, FieldPacket[]],
  message?: string,
  statusCode = 500,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  if (Array.isArray(res[0])) {
    // 쿼리 결과가 없을경우 에러메세지가 있으면 throw error
    if (res[0].length === 0) {
      if (message) throw new CustomError(message, statusCode);
      return null;
    }
    return res[0][0];
  }
};

/**
 * - 쿼리결과 배열 리턴하는 함수
 * @param res - 쿼리 결과값
 * @returns 쿼리 결과 배열
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDbResultArr = (res: [QueryResult, FieldPacket[]]): any => {
  if (Array.isArray(res[0])) return res[0];
};

/**
 * - cookie string에서 원하는 key의 value를 return해주는 함수
 * @returns - target key's value
 */
export function getCookieValue(
  targetKey: string,
  queryString?: string,
): string | number | null {
  if (!queryString) return null;

  const cookies = queryString.split('; ');

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === targetKey) return value;
  }

  return null;
}

/**
 * - 현재 line return
 */
export function getCurrentLine() {
  const stack = new Error().stack;
  if (!stack) return undefined;

  const line = stack.split('\n')[2];

  const match = line.match(/:(\d+):\d+/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * - 에러메세지 생성
 */
export function buildErrorMessage(
  message: string,
  file: string,
  line?: number,
): string {
  return `${message} (ERR_CODE: ${file}_${line})`;
}
