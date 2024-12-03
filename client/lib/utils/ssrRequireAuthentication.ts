import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { serialize } from 'cookie';

import { checkToken } from '@utils/auth';

const ssrRequireAuthentication =
  (
    gssp?: (
      ctx?: GetServerSidePropsContext,
      userData?: UserState,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any,
  ) =>
  async (ctx: GetServerSidePropsContext) => {
    //* URL data
    const protocol =
      ctx.req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = ctx.req.headers.host;
    const resolvedUrl = ctx.resolvedUrl;
    const fullUrl = `${protocol}://${host}${resolvedUrl}`;
    const pathName = new URL(fullUrl).pathname;

    const returnData: {
      pathName: string;
      query: ParsedUrlQuery;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gsspProps?: any;
      userData?: UserState;
    } = {
      pathName,
      query: ctx.query,
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
            secure: false, //TODO 배포시 true로 변경
          },
        );
        const accessTokenCookie = serialize('accessToken', accessToken, {
          maxAge: 60 * 15, // 15분
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: false, //TODO 배포시 true로 변경
        });
        ctx.res.setHeader('Set-Cookie', [
          refreshTokenHashIdxCookie,
          accessTokenCookie,
        ]);

        returnData.userData = checkTokenRes.userData;
      } else {
        /**
         * SSR의 경우 express에서 res.cookie로 쿠키설정시 브라우저까지
         * 정보가 가지않기때문에 별도로 쿠키설정해줌
         */
        const refreshTokenHashIdxCookie = serialize('refreshTokenHashIdx', '', {
          maxAge: 0, // 1일
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: false, //TODO 배포시 true로 변경
        });
        const accessTokenCookie = serialize('accessToken', '', {
          maxAge: 0, // 15분
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          secure: false, //TODO 배포시 true로 변경
        });
        ctx.res.setHeader('Set-Cookie', [
          refreshTokenHashIdxCookie,
          accessTokenCookie,
        ]);

        returnData.userData = {
          name: 'guest',
          isLogin: false,
          auth: 0,
          birth: '',
          datetime: '',
          id: '',
          phone: '',
          updateDatetime: '',
          email: '',
        };
      }
    } catch (err) {
      console.error(err);
    }

    //* GSSP callback
    if (typeof gssp === 'function') {
      const gsspProps = await gssp(ctx, returnData.userData);
      if (gsspProps) {
        //* redirect
        if (gsspProps.redirect) {
          return {
            redirect: {
              destination: gsspProps.redirect,
            },
            props: {},
          };
        }
        returnData.gsspProps = gsspProps;
      }
    }

    return {
      props: returnData,
    };
  };
export default ssrRequireAuthentication;
