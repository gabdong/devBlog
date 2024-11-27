import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

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
      const checkTokenRes = await checkToken(true, ctx.req.headers.cookie);
      if (checkTokenRes && checkTokenRes.userData)
        returnData.userData = checkTokenRes.userData;
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
