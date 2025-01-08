import styled from 'styled-components';
import { useState } from 'react';

import { uploadImageFn } from '@apis/images';
import useInput from '@hooks/useInput';
import useModal from '@hooks/useModal';

import Button from '@components/Button';
import Input from '@components/Input';

export default function AddImageModal({
  ...props
}: AddImageModalProps): JSX.Element {
  const {
    callBackType,
    setEditorState,
    setThumbnailUrl,
    setThumbnailIdx,
    setThumbnailAlt,
  } = props;
  const { closeModal } = useModal();
  const [previewImage, setPreviewImage] = useState<string>();
  const [uploadImage, setUploadImage] = useState<File>();
  const [alt, altHandler] = useInput('');

  return (
    <AddImageModalSt className="modalContent">
      <PreviewWrapSt>
        {previewImage ? (
          <ThumbnailImgSt id="thumbnail" src={previewImage} alt={alt} />
        ) : (
          <label
            htmlFor="addImageInput"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              fontSize: '42px',
              cursor: 'pointer',
            }}
          >
            +
          </label>
        )}
      </PreviewWrapSt>
      {previewImage ? (
        <Button>
          <label
            htmlFor="addImageInput"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          >
            변경하기
          </label>
        </Button>
      ) : null}
      <AddImageFormSt
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <InputWrapSt>
          <Input
            id="addImageInput"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                const file = target.files[0];
                const allowedExtensions = [
                  'image/png',
                  'image/jpg',
                  'image/jpeg',
                  'image/gif',
                ];
                if (!allowedExtensions.includes(file.type))
                  return alert('잘못된 확장자입니다.');

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  if (typeof reader.result === 'string')
                    setPreviewImage(reader.result);
                  setUploadImage(file);
                };
              }
            }}
            style={{ display: 'none' }}
            accept="image/jpeg, image/jpg, image/png, image/gif"
          />
          <InputContainerSt>
            <span className="caption">이미지 설명</span>
            <Input
              type="text"
              placeholder="이미지 설명을 입력해주세요. ( 15자 이내 )"
              defaultValue={alt}
              onChange={altHandler}
              border="bottom"
              maxLength={15}
            />
          </InputContainerSt>
        </InputWrapSt>
        <Button
          text="Add Image"
          theme="border"
          style={{ alignSelf: 'center' }}
          id="addImageBtn"
          event={async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;

            if (!uploadImage) return alert('이미지를 추가해주세요.');
            if (!alt) return alert('이미지 설명을 입력해주세요.');

            const uploadImageRes = await uploadImageFn(uploadImage, alt);

            if (typeof uploadImageRes === 'object' && uploadImageRes.imageIdx) {
              const { imageIdx, imageUrl, imageAlt } = uploadImageRes;

              console.log(setEditorState);
              if (callBackType === 'editor' && setEditorState) {
                // 에디터 이미지 추가인경우
                setEditorState(
                  (prev: string) => (prev += `![${imageAlt}](${imageUrl})`),
                );
              } else if (callBackType === 'postThumbnail') {
                // 게시글 썸네일 설정인경우
                setThumbnailUrl(imageUrl);
                setThumbnailIdx(imageIdx);
                setThumbnailAlt(imageAlt);
              }
            }

            closeModal();
          }}
        />
      </AddImageFormSt>
    </AddImageModalSt>
  );
}

const AddImageModalSt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  width: 420px;
  max-width: 100%;
  padding: 50px 30px 30px 30px;
`;
const PreviewWrapSt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 200px;
  height: 200px;
  padding: 8px;
  border: 1px solid var(--gray-l);
  border-radius: var(--border-radius);
`;
const ThumbnailImgSt = styled.img`
  height: 100%;
`;
const AddImageFormSt = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
const InputWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  width: 100%;
`;
const InputContainerSt = styled.div`
  display: flex;
  flex-direction: column;

  & span {
    color: var(--gray-l);
  }
`;
