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
  const [subject, subjectHandler, setSubject] = useInput('');
  const [subtitle, subtitleHandler, setSubtitle] = useInput('');
  const [content, setContent] = useState<string>('');
  const [addTagName, addTagNameHandler, setAddTagName] = useInput('');
  const [addedTagList, setAddedTagList] = useState([] as string[]);

  useEffect(() => {
    setSubject(postData.subject);
    setContent(postData.content);
    setSubtitle(postData.subtitle || '');
    setAddedTagList(postData.tagNameData ? [...postData.tagNameData] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData.idx]);

  return (
    <EditorWrapSt>
      {/* //* 태그추가 */}
      <SettingInputWrapSt>
        <h3 className="smallTitle">
          태그<span className="caption"> (미선택시 비공개)</span>
        </h3>
        <TagSettingWrapSt>
          <Input
            defaultValue={addTagName}
            onChange={addTagNameHandler}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && addTagName) {
                if (addedTagList.includes(addTagName))
                  return alert('이미 선택된 태그입니다.');
                setAddedTagList((prev) => [...prev, addTagName]);
                setAddTagName('');
              }
            }}
            border="bottom"
            style={{ color: 'var(--gray-l)', flex: 1 }}
            placeholder="입력 후 엔터로 추가해주세요."
          />
          <AddedTagListSt>
            {addedTagList.length > 0 ? (
              addedTagList.map((tagName) => (
                <AddedTagItemSt
                  key={tagName}
                  className="caption"
                  data-tag-name={tagName}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const target = e.target as HTMLDivElement;
                    const removeName = target.dataset.tagName;

                    setAddedTagList((prev) => [
                      ...prev.filter((name) => name !== removeName),
                    ]);
                  }}
                >
                  {tagName}
                </AddedTagItemSt>
              ))
            ) : (
              <span className="caption">선택된 태그가 없습니다.</span>
            )}
          </AddedTagListSt>
        </TagSettingWrapSt>
      </SettingInputWrapSt>

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
                { subject, subtitle, content, tagNameData: addedTagList },
                router,
              );
            } else {
              return uploadPost(
                'N',
                { subject, subtitle, content, tagNameData: addedTagList },
                router,
              );
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
                { subject, subtitle, content, tagNameData: addedTagList },
                router,
              );
            } else {
              return uploadPost(
                'Y',
                { subject, subtitle, content, tagNameData: addedTagList },
                router,
              );
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
const TagSettingWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AddedTagListSt = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  padding: 8px 12px;
`;
const AddedTagItemSt = styled.div`
  display: flex;
  padding: 8px 12px;
  border: 1px solid var(--gray-l);
  border-radius: var(--border-radius);
  color: var(--gray-l);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;
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
