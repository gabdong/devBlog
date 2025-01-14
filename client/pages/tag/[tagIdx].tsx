import { getPostList } from '@apis/posts';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import PostList from '@components/PostList';
import Pagination from '@components/Pagination';

interface TagPageProps extends PageProps {
  gsspProps: { postList: PostData[]; totalCnt: number };
  query: {
    tagIdx: 'total' | 'private' | number;
    page: number;
    search?: string;
  };
}
export default function Tag({
  gsspProps: { postList, totalCnt },
  ...rest
}: TagPageProps) {
  const { page, tagIdx, search } = rest.query;
  const paginationPath = search
    ? `/tag/${tagIdx}?search=${search}`
    : `/tag/${tagIdx}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <PostList postList={postList} />
      <Pagination
        totalCnt={totalCnt}
        page={Number(page)}
        paginationCnt={10}
        limit={12}
        path={paginationPath}
      />
    </div>
  );
}

export const getServerSideProps = ssrRequireAuthentication(
  async (ctx, userData) => {
    const { page, tagIdx, search } = ctx.query;
    const getPostListRes = await getPostList(
      tagIdx !== 'total' && tagIdx !== 'private' && tagIdx !== 'search'
        ? Number(tagIdx)
        : tagIdx,
      page ? Number(page) : 1,
      12,
      true,
      userData,
      search ? String(search) : '',
    );
    const { postList, totalCnt } = getPostListRes;

    return { postList, totalCnt };
  },
);
