import axios, { AxiosInstance } from 'axios';

export const instance: AxiosInstance = axios.create({
  timeout: 10000,
  withCredentials: true, // CORS 요청 허용
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return Promise.reject({
      status: err.response?.status ?? 500,
      statusText: 'FAIL',
      data: {
        message: err.response?.data.message ?? '요청을 실패하였습니다.',
        errorAlert: err.response?.data.errorAlert ?? true,
      },
    });
  },
);
export default instance;

/**
 * * try catch에서 err가 axios interceptors custom error인지 확인
 * @param err - try catch 의 catch param
 * @returns {Boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAxiosCustomError(err: any): err is CustomAxiosError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'statusText' in err &&
    'data' in err &&
    'message' in err.data &&
    'errorAlert' in err.data
  );
}
