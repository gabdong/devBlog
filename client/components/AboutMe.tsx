import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

export default function AboutMe({ ...pageProps }) {
  console.log(pageProps);
  return <div style={{ height: '1000px', background: 'green' }}>about_me</div>;
}

export const getServerSideProps = ssrRequireAuthentication();
