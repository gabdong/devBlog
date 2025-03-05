import Image from 'next/image';
import styled from 'styled-components';
import { BsCalendar2DateFill } from 'react-icons/bs';
import Link from 'next/link';

const DEFAULT_THUMBNAIL = [
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_7254.jpg',
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_8037.jpg',
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_8039.jpg',
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_7876.jpg',
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_7477.jpg',
  'https://gabdong.s3.ap-northeast-2.amazonaws.com/images/DSC_6062.jpg',
];
let defaultThumbnailIndex = 0;

export default function PostList({ postList }: { postList: PostData[] }) {
  return (
    <PostListWrapSt>
      <h2 hidden>게시글 리스트</h2>
      {postList.length === 0 ? (
        <h2 className="subTitle">게시글이 존재하지 않습니다.</h2>
      ) : (
        postList.map((data) => {
          defaultThumbnailIndex++;

          if (defaultThumbnailIndex > DEFAULT_THUMBNAIL.length - 1)
            defaultThumbnailIndex = 0;

          return (
            <PostItemSt key={data.idx}>
              <Link href={`/post/${data.idx}`}>
                <div className="postThumbnailWrap">
                  {data.thumbnailUrl && data.thumbnailAlt ? (
                    <Image
                      src={data.thumbnailUrl}
                      alt={data.thumbnailAlt}
                      // width={100}
                      fill={true}
                      // height={100}
                      quality={75}
                    />
                  ) : (
                    <div className="postInitialThumbnail">
                      <Image
                        src={DEFAULT_THUMBNAIL[defaultThumbnailIndex]}
                        alt="기본 썸네일 이미지"
                        fill={true}
                        style={{ objectFit: 'cover' }}
                        quality={75}
                      />
                    </div>
                  )}
                </div>
                <div className="postInfoWrap">
                  <h3 className="postSubject subTitle">{data.subject}</h3>
                  <p className="postContent normalText">{data.subtitle}</p>
                  <div>
                    <BsCalendar2DateFill />
                    <span className="postDatetime caption">
                      {data.datetime}
                    </span>
                  </div>
                </div>
              </Link>
            </PostItemSt>
          );
        })
      )}
    </PostListWrapSt>
  );
}

const PostListWrapSt = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media all and (max-width: ${process.env.NEXT_PUBLIC_TABLET_WIDTH}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    grid-template-columns: 1fr;
  }
`;
const PostItemSt = styled.article`
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    border-color: var(--primary-color);
  }

  a {
    display: flex;
    flex-direction: column;

    height: 100%;
  }

  .postThumbnailWrap {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    aspect-ratio: 1.6 / 1;
    position: relative;

    img {
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }
  }

  .postInitialThumbnail {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    aspect-ratio: 1.6 / 1;
    background: var(--gray-l);

    svg {
      font-size: 36px;
      color: var(--gray);
    }
  }

  .postInfoWrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;

    padding: 12px;
    background: var(--gray);

    & > div {
      display: flex;
      align-items: center;
      gap: 10px;

      font-size: 12px;
    }

    .postContent {
      flex: 1;

      margin-bottom: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;
