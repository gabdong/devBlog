import useHydrateStore from '@hooks/useHydrateStore';

import AboutMe from '@pages/about_me';
import Post from '@pages/post';

export default function Index({ ...pageProps }): JSX.Element {
  useHydrateStore(pageProps);

  const { pathName } = pageProps;

  return (
    <>{pathName == '/about_me' || pathName == '/' ? <AboutMe /> : <Post />}</>
  );
}
