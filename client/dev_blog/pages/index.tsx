import styled from "styled-components";
import AboutMe from "./about_me";
import Post from "./post";

interface props {
  pathName: string;
}
export default function Index(props: props): JSX.Element {
  console.log(props);
  return (
    <>
      <div>component</div>
      <AboutMe></AboutMe>
      <Post></Post>
    </>
  );
}

// export const getServerSideProps = ssrRequireAuthentication();

const HomeWrapSt = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;

  min-width: 0;
  max-width: 100%;
`;
