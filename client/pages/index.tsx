import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import AboutMe from '@components/AboutMe';
import PostList from '@components/PostList';
import { getPostList } from '@apis/posts';

interface IndexPageProps extends PageProps {
  query: { tab?: string };
  gsspProps?: { postList: PostData[] };
}

export default function Index({
  query: { tab },
  ...rest
}: IndexPageProps): JSX.Element {
  const postList =
    tab === 'latest_content' && rest.gsspProps ? rest.gsspProps.postList : [];

  return (
    <>
      {tab === 'latest_content' ? (
        <PostList postList={postList} />
      ) : (
        <AboutMe />
      )}
    </>
  );
}

export const getServerSideProps = ssrRequireAuthentication(
  async (ctx, userData) => {
    const { tab } = ctx.query;
    if (tab === 'latest_content') {
      const getPostListRes = await getPostList(
        'latest',
        1,
        12,
        false,
        userData,
      );
      const { postList } = getPostListRes;

      return { postList };
    }
  },
);
