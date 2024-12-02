import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import AboutMe from '@pages/about_me';
import Post from '@pages/post';

export default function Index({ ...pageProps }: PageProps): JSX.Element {
  console.log(pageProps);
  const { pathName } = pageProps;

  return (
    <>
      {pathName == '/about_me' || pathName == '/' ? (
        <AboutMe {...pageProps} />
      ) : (
        <Post {...pageProps} />
      )}
    </>
  );
}

export const getServerSideProps = ssrRequireAuthentication();
