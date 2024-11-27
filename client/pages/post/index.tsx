import useHydrateStore from '@hooks/useHydrateStore';
import { useAppSelector } from '@redux/hooks';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function Post({ ...pageProps }: PageProps): JSX.Element {
  useHydrateStore(pageProps);
  const user = useAppSelector((store) => store.user);

  console.log(user);
  return <div>post</div>;
}
export const getServerSideProps = ssrRequireAuthentication();
