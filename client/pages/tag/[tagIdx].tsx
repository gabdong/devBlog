import { getPostList } from '@apis/posts';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import PostList from '@components/PostList';
import Pagination from '@components/Pagination';

interface TagPageProps extends PageProps {
  gsspProps: { postList: PostData[]; totalCnt: number };
  query: { tagIdx: 'total' | 'private' | number; page: number };
}
export default function Tag({
  gsspProps: { postList, totalCnt },
  ...rest
}: TagPageProps) {
  const { page, tagIdx } = rest.query;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PostList postList={postList} />
      <Pagination
        totalCnt={totalCnt}
        page={Number(page)}
        paginationCnt={10}
        limit={12}
        path={`/tag/${tagIdx}`}
      />
    </div>
  );
}

export const getServerSideProps = ssrRequireAuthentication(
  async (ctx, userData) => {
    const { page, tagIdx } = ctx.query;
    const getPostListRes = await getPostList(
      tagIdx !== 'total' && tagIdx !== 'private' ? Number(tagIdx) : tagIdx,
      page ? Number(page) : 1,
      12,
      true,
      userData,
    );
    const { postList, totalCnt } = getPostListRes;

    return { postList, totalCnt };
  },
);
