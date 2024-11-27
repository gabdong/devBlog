import axios, { isAxiosCustomError } from '@utils/axios';

/**
 * * 토큰정보 조회후 유저정보, 토큰정보를 return 해주는 함수
 */
export async function checkToken(
  ssr: boolean,
  cookie?: string,
): Promise<{ userData: UserState; accessToken: string } | void> {
  if (cookie) axios.defaults.headers.cookie = cookie;

  try {
    const {
      data: { userData, accessToken },
    } = await axios.get('/apis/auths/check-token', {
      data: {
        isCheckToken: true,
      },
    });
    return { userData, accessToken };
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.error(err);
    }
  }
}

/**
 * * 로그아웃시 토큰을 제거해주는 함수
 */
export async function removeToken() {
  await axios.delete('/apis/auths');
}
