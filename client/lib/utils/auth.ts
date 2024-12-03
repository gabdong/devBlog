import axios, { isAxiosCustomError } from '@utils/axios';

/**
 * * 토큰정보 조회후 유저정보, 토큰정보를 return 해주고 토큰만료된경우 cookie제거해주는 함수
 */
export async function checkToken(cookie?: string): Promise<{
  userData: UserState;
  accessToken: string;
  refreshTokenHashIdx: string;
} | void> {
  try {
    const {
      data: { userData, accessToken, refreshTokenHashIdx },
    } = await axios.get('/apis/auths/check-token', {
      headers: {
        Cookie: cookie ?? '',
      },
      data: {
        isCheckToken: true,
      },
    });

    return { userData, accessToken, refreshTokenHashIdx };
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.error(err);
    }

    removeToken();
  }
}

/**
 * * 로그아웃시 토큰을 제거해주는 함수
 */
export async function removeToken() {
  try {
    await axios.delete('/apis/auths');
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.error(err);
    }
  }
}
