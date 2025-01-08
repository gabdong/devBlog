import { GetServerSidePropsContext } from 'next';
import { serialize } from 'cookie';
import { ParsedUrlQuery } from 'querystring';

import { checkToken } from '@utils/auth';
import { getTagList } from '@apis/tags';

interface GsspReturnProps {
  pathName: string;
  query: ParsedUrlQuery;
  gsspProps?: unknown;
  userData: UserState;
  tagList: TagData[];
  totalPostCnt: number;
  privatePostCnt: number;
}

const ssrRequireAuthentication =
  (gssp?: (ctx: GetServerSidePropsContext, userData: UserState) => unknown) =>
  async (ctx: GetServerSidePropsContext) => {
    //* URL data
    const protocol =
      ctx.req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = ctx.req.headers.host;
    const resolvedUrl = ctx.resolvedUrl;
    const fullUrl = `${protocol}://${host}${resolvedUrl}`;
    const pathName = new URL(fullUrl).pathname;

    //* return data initial
    const returnData: GsspReturnProps = {
      pathName,
      query: ctx.query,
      userData: {
        idx: 0,
        name: 'guest',
        isLogin: false,
        auth: 0,
        birth: '',
        datetime: '',
        id: '',
        phone: '',
        updateDatetime: '',
        email: '',
      },
      tagList: [],
      totalPostCnt: 0,
      privatePostCnt: 0,
    };

    //* User data
    try {
      const checkTokenRes = await checkToken(ctx.req.headers.cookie);

      if (checkTokenRes && checkTokenRes.userData) {
        const { refreshTokenHashIdx, accessToken } = checkTokenRes;

        /**
         * SSR의 경우 express에서 res.cookie로 쿠키설정시 브라우저까지
         * 정보가 가지않기때문에 별도로 쿠키설정해줌
         */
        const refreshTokenHashIdxCookie = serialize(
          'refreshTokenHashIdx',
          refreshTokenHashIdx,
          {
            maxAge: 60 * 60 * 24, // 1일
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
          },
        );
        const accessTokenCookie = serialize('accessToken', accessToken, {
          maxAge: 60 * 15, // 15분
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });
        ctx.res.setHeader('Set-Cookie', [
          refreshTokenHashIdxCookie,
          accessTokenCookie,
        ]);

        returnData.userData = checkTokenRes.userData;
      } else {
        // 로그인 정보 없을경우 쿠키 제거
        const refreshTokenHashIdxCookie = serialize('refreshTokenHashIdx', '', {
          maxAge: 0,
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });
        const accessTokenCookie = serialize('accessToken', '', {
          maxAge: 0,
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });
        ctx.res.setHeader('Set-Cookie', [
          refreshTokenHashIdxCookie,
          accessTokenCookie,
        ]);
      }
    } catch (err) {
      console.error(err);
    }

    //* Tag Data
    try {
      const { tagList, totalPostCnt, privatePostCnt } = await getTagList({
        userData: returnData.userData,
      });

      if (tagList.length > 0) returnData.tagList = tagList;
      if (totalPostCnt > 0) returnData.totalPostCnt = totalPostCnt;
      if (privatePostCnt > 0 && returnData.userData.isLogin)
        returnData.privatePostCnt = privatePostCnt;
    } catch (err) {
      console.error(err);
    }

    //* Private Page redirect
    const privatePage = ['private', 'settings', 'write'];
    for (const privateKey of privatePage) {
      if (resolvedUrl.includes(privateKey) && !returnData.userData.isLogin) {
        return {
          redirect: {
            destination: '/401',
          },
        };
      }
    }

    //* GSSP callback
    if (typeof gssp === 'function') {
      const gsspProps = await gssp(ctx, returnData.userData);
      if (gsspProps) {
        //* redirect
        if (typeof gsspProps === 'object' && 'redirect' in gsspProps) {
          return {
            redirect: {
              destination: gsspProps.redirect,
            },
            props: {
              returnData,
            },
          };
        }

        //* GSSP return data
        returnData.gsspProps = gsspProps;
      }
    }

    return {
      props: returnData,
    };
  };
export default ssrRequireAuthentication;
