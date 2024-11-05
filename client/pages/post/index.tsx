import useHydrateStore from '@hooks/useHydrateStore';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function Post({ ...pageProps }: PageProps): JSX.Element {
  useHydrateStore(pageProps);

  return <div>post</div>;
}
export const getServerSideProps = ssrRequireAuthentication();
