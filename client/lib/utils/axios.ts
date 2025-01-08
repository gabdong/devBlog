import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { checkToken } from '@utils/auth';

const isServer = typeof 'window' === 'undefined';

export const instance: AxiosInstance = axios.create({
  baseURL: isServer
    ? `${process.env.REACT_APP_SERVER_URL}/lib`
    : process.env.REACT_APP_CLIENT_URL, // client는 next config에서 rewrite중
  timeout: 10000,
  withCredentials: true, // CORS 요청 허용
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.data) return config;

    const isFormData = config.data instanceof FormData;
    const checkTokenVal = isFormData
      ? config.data.get('checkToken') === 'true'
      : config.data.checkToken || false; // 로그인 판별이 필요한 요청
    const isCheckToken = config.data.isCheckToken || false; // 토큰정보조회 함수에서 호출 여부

    //* front 요청에서 로그인검증 필요할경우
    if (checkTokenVal && !isCheckToken) {
      try {
        const checkTokenRes = await checkToken();
        if (checkTokenRes) {
          const { userData } = checkTokenRes;

          if (userData) {
            if (isFormData) {
              config.data.append('userData', JSON.stringify(userData));
            } else {
              config.data.userData = userData;
            }
          }
        }
      } catch (err) {
        if (isAxiosCustomError(err)) return Promise.reject(err);
      }
    }

    return config;
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (isAxiosCustomError(err)) return Promise.reject(err);

    return Promise.reject({
      status: err.response?.status ?? 500,
      statusText: 'FAIL',
      data: {
        message: err.response?.data.message ?? '요청을 실패하였습니다.',
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
    'message' in err.data
  );
}
