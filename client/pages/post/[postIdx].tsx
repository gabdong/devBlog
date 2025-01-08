import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { deletePost, getPost } from '@apis/posts';
import { isAxiosCustomError } from '@utils/axios';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import LinkButton from '@components/LinkButton';
import Button from '@components/Button';
import dynamic from 'next/dynamic';

const EditorMarkdown = dynamic(
  () =>
    import('@uiw/react-md-editor').then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false },
);

interface PostPageProps extends PageProps {
  gsspProps: { postData: PostData };
}

export default function Post({ ...pageProps }: PostPageProps): JSX.Element {
  const {
    gsspProps: { postData },
    userData,
  } = pageProps;
  const isWriter = userData.auth === 10 || userData.idx === postData.writerIdx;
  const router = useRouter();

  return (
    <PostWrapSt>
      {/* //* 제목 */}
      <h2 className="headline">{postData.subject}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* //* 작성자, 작성일 */}
        <PostInfoWrapSt>
          <h3 className="subTitle">{postData.memberName}</h3>
          <p className="normalText">
            {postData.datetime &&
              new Date(postData.datetime).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
          </p>
        </PostInfoWrapSt>

        {/* //* 수정, 삭제 버튼 */}
        {!isWriter ? null : (
          <PostButtonWrapSt>
            <LinkButton
              text="수정"
              href={`/editor/edit?postIdx=${postData.idx}`}
              theme="none"
            />
            <Button
              text="삭제"
              theme="none"
              event={() => {
                if (!postData.idx) return alert('게시글 정보가 없습니다.');
                return deletePost(postData.idx, router);
              }}
            />
          </PostButtonWrapSt>
        )}
      </div>

      {/* //* 썸네일 */}
      {postData.thumbnailUrl && postData.thumbnailAlt && (
        <ThumbnailWrapSt>
          <Image
            src={postData.thumbnailUrl}
            alt={postData.thumbnailAlt}
            fill={true}
          />
        </ThumbnailWrapSt>
      )}

      {/* //* 내용 */}
      <PostContentSt source={postData.content} />
    </PostWrapSt>
  );
}

const PostWrapSt = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;

  min-width: 0;
  max-width: 100%;
  height: 100%;

  & img {
    max-width: 100%;
  }
`;
const PostInfoWrapSt = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  & .normalText {
    margin-top: 2px;
  }
`;
const PostButtonWrapSt = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > .buttonText {
    cursor: pointer;
    transition: var(--transition);
  }

  & > .buttonText:hover {
    color: #ffffff;
  }
`;
const ThumbnailWrapSt = styled.div`
  width: auto;
  height: 400px;
  text-align: center;
  position: relative;

  img {
    width: auto !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
  }

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    & img {
      max-width: 90%;
    }
  }
`;
const PostContentSt = styled(EditorMarkdown)`
  background: none !important;

  & .anchor {
    display: none;
  }
`;

export const getServerSideProps = ssrRequireAuthentication(
  async (ctx, userData) => {
    const {
      query: { postIdx },
    } = ctx;

    try {
      const postData = await getPost(Number(postIdx), userData);

      return { postData };
    } catch (err) {
      if (isAxiosCustomError(err)) {
        return {
          redirect: `/${err.status}`,
        };
      } else {
        console.error(err);
      }
    }
  },
);
