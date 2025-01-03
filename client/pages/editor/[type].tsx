import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { editPost, getPost, uploadPost } from '@apis/posts';
import useInput from '@hooks/useInput';
import ssrRequireAuthentication from '@utils/ssrRequireAuthentication';

import Input from '@components/Input';
import Editor from '@components/Editor';
import Button from '@components/Button';
import { isAxiosCustomError } from '@utils/axios';

interface WritePageProps extends PageProps {
  query: { type: string };
  gsspProps: { postData: PostData };
}

export default function Write({ ...pageProps }: WritePageProps) {
  const {
    gsspProps: { postData },
  } = pageProps;
  const router = useRouter();

  const { type } = pageProps.query;
  const [subject, subjectHandler, setSubject] = useInput(postData.subject);
  const [subtitle, subtitleHandler, setSubtitle] = useInput(postData.subtitle);
  const [content, setContent] = useState<string>(postData.content);

  useEffect(() => {
    setSubject(postData.subject);
    setSubtitle(postData.subtitle);
    setContent(postData.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData.idx]);

  return (
    <EditorWrapSt>
      {/* //* 태그추가 */}
      <SearchTagWrapSt>
        <h3 className="smallTitle">태그</h3>
      </SearchTagWrapSt>

      {/* //* 제목설정 */}
      <SettingInputWrapSt>
        <h3 className="smallTitle">
          제목 <span className="caption">(필수)</span>
        </h3>
        <Input
          defaultValue={subject}
          onChange={subjectHandler}
          border="bottom"
          style={{
            color: 'var(--gray-l)',
          }}
          placeholder="입력"
        />
      </SettingInputWrapSt>

      {/* //* 부제목설정 */}
      <SettingInputWrapSt>
        <h3 className="smallTitle">
          부제목 <span className="caption">(필수)</span>
        </h3>
        <Input
          defaultValue={subtitle}
          onChange={subtitleHandler}
          border="bottom"
          style={{
            color: 'var(--gray-l)',
          }}
          placeholder="입력"
        />
      </SettingInputWrapSt>

      {/* //* 게시글 에디터 */}
      <SettingInputWrapSt>
        <h3 className="smallTitle">
          내용 <span className="caption">(필수)</span>
        </h3>
        <Editor value={content} onChange={setContent} height={500} />
      </SettingInputWrapSt>

      {/* //* 저장, 취소버튼 */}
      <ButtonWrapSt>
        <Button
          text="비공개"
          event={() => {
            if (type == 'edit') {
              if (!postData.idx) return alert('게시글 번호가 없습니다.');
              return editPost(
                postData.idx,
                'N',
                { subject, subtitle, content },
                router,
              );
            } else {
              return uploadPost('N', { subject, subtitle, content }, router);
            }
          }}
        />
        <Button
          text={type === 'edit' ? '수정' : '저장'}
          style={{ background: 'var(--primary-color)' }}
          event={() => {
            if (type === 'edit') {
              if (!postData.idx) return alert('게시글 번호가 없습니다.');
              return editPost(
                postData.idx,
                'Y',
                { subject, subtitle, content },
                router,
              );
            } else {
              return uploadPost('Y', { subject, subtitle, content }, router);
            }
          }}
        />
      </ButtonWrapSt>
    </EditorWrapSt>
  );
}

const EditorWrapSt = styled.article`
  display: flex;
  flex-direction: column;
  gap: 25px;

  width: 100%;
`;
// const SelectedTagsWrapSt = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;
// const SelectedTagsItemSt = styled.div`
//   padding: var(--small-box-padding);
//   border-radius: var(--border-radius);
//   background: var(--dark-l-o);
//   transition: var(--transition);
//   cursor: pointer;

//   & > .caption {
//     color: var(--primary-color-d-text);
//   }
//   &:hover {
//     background: var(--dark-l);
//   }
// `;
// const ThumbnailSettingWrapSt = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;
// const ThumbnailPreivewWrapSt = styled.div`
//   height: 120px;
//   padding: 8px;
//   border: 1px solid #dddddd;
//   border-radius: var(--border-radius);
// `;
// const ThumbnailImgSt = styled.img`
//   height: 100%;
// `;
const SearchTagWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  position: relative;
`;
// const SearchTagResultWrapSt = styled.div`
//   display: none;
//   gap: 8px;

//   width: 100%;
//   padding: var(--box-padding);
//   background: var(--dark);
//   border: 1px solid var(--gray);
//   border-radius: var(--border-radius);
//   position: absolute;
//   top: calc(100% + 10px);

//   &.active {
//     display: flex;
//     align-items: center;
//     flex-wrap: wrap;
//     z-index: 1;
//   }
// `;
const SettingInputWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ButtonWrapSt = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  width: 100%;
`;

export const getServerSideProps = ssrRequireAuthentication(
  async (ctx: GetServerSidePropsContext, userData) => {
    if (!userData.isLogin)
      return {
        redirect: '/401',
      };

    const { type } = ctx.query;

    if (type !== 'edit')
      return { postData: { idx: 0, subject: '', content: '' } };

    const postIdx = Number(ctx.query.postIdx);

    try {
      const postData = await getPost(postIdx, userData);

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
