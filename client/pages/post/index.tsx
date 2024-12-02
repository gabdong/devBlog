import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function Post({ ...pageProps }: PageProps): JSX.Element {
  console.log(pageProps);
  return <div>post</div>;
}
export const getServerSideProps = ssrRequireAuthentication();
