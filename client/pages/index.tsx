// import { styled } from 'styled-components';

import AboutMe from '@/pages/about_me';
import Post from '@/pages/post';

export default function Index({ pathName }: { pathName: string }): JSX.Element {
  return (
    <>{pathName == '/about_me' || pathName == '/' ? <AboutMe /> : <Post />}</>
  );
}

// export const getServerSideProps = ssrRequireAuthentication();

// const HomeWrapSt = styled.section`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   gap: 20px;

//   min-width: 0;
//   max-width: 100%;
// `;
