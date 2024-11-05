import useHydrateStore from '@hooks/useHydrateStore';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function AboutMe({ ...pageProps }: PageProps): JSX.Element {
  useHydrateStore(pageProps);

  return <div>about_me</div>;
}

export const getServerSideProps = ssrRequireAuthentication();
