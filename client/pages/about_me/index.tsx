import useHydrateStore from '@hooks/useHydrateStore';
import { useAppSelector } from '@redux/hooks';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function AboutMe({ ...pageProps }: PageProps): JSX.Element {
  useHydrateStore(pageProps);
  const user = useAppSelector((store) => store.user);

  console.log(user);
  return <div>about_me</div>;
}

export const getServerSideProps = ssrRequireAuthentication();
