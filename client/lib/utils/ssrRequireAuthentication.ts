import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getCookieValue } from '@utils/utils';
import { checkToken } from '@utils/auth';
import { isAxiosCustomError } from './axios';

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
    const refreshTokenIdx = getCookieValue(
      'refreshTokenIdx',
      ctx.req.headers.cookie,
    );
    let userData;
    if (refreshTokenIdx && typeof refreshTokenIdx === 'string') {
      try {
        await checkToken(true, refreshTokenIdx);
      } catch (err) {
        if (isAxiosCustomError(err)) {
          console.log(err);
          const {
            data: { message, errorAlert },
          } = err;
          if (errorAlert) alert(message);
        } else {
          console.error(err);
        }
      }
      userData = { name: 'TEST' };

      returnData.userData = userData;
    }

    //* GSSP callback
    if (typeof gssp === 'function') {
      const gsspProps = await gssp(ctx, userData);
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
