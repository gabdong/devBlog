import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { deletePost, getPost } from '@apis/posts';
import { isAxiosCustomError } from '@utils/axios';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import LinkButton from '@components/LinkButton';
import Button from '@components/Button';

interface PostPageProps extends PageProps {
  gsspProps: { postData: PostData };
}

export default function Post({ ...pageProps }: PostPageProps): JSX.Element {
  const {
    gsspProps: { postData },
    userData,
  } = pageProps;
  const isWriter = userData.idx === postData.writerIdx;
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
            >
              삭제
            </Button>
          </PostButtonWrapSt>
        )}
      </div>

      {/* //* 썸네일 */}
      {postData.thumbnail && (
        <ThumbnailWrapSt>
          <Image
            src={postData.thumbnail}
            alt={postData.thumbnailAlt || '게시글 썸네일'}
          />
        </ThumbnailWrapSt>
      )}

      {/* //* 내용 */}
      <PostContentSt>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {postData.content}
        </ReactMarkdown>
      </PostContentSt>
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
  width: 100%;
  text-align: center;

  & img {
    max-width: 50%;
  }

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    & img {
      max-width: 90%;
    }
  }
`;
const PostContentSt = styled.div`
  word-break: break-all;

  & h1 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid var(--gray-l);
    font-size: 2rem;
    font-weight: 600;
  }

  & h2 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid var(--gray-l);
    font-size: 1.5rem;
    font-weight: 600;
  }

  & h3 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    font-size: 1.17rem;
  }

  & h4 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    font-size: 1rem;
  }

  & h5 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    font-size: 0.875rem;
  }

  & h6 {
    margin: 0.67rem 0;
    padding-bottom: 0.3rem;
    font-size: 0.85rem;
    color: var(--gray-l);
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
