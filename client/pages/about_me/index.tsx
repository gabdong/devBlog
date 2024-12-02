import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function AboutMe({ ...pageProps }: PageProps): JSX.Element {
  console.log(pageProps);
  return <div>about_me</div>;
}

export const getServerSideProps = ssrRequireAuthentication();
