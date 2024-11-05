import axios from '@utils/axios';

export async function checkToken(ssr: boolean, refreshTokenIdx: string) {
  const path = ssr
    ? `${process.env.REACT_APP_SERVER_URL}/lib/apis/auths/check-token`
    : '/apis/auths/check-token';
  await axios.get(path, {
    data: {
      refreshTokenIdx,
    },
  });
}
