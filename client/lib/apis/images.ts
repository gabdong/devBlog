import axios, { isAxiosCustomError } from '@utils/axios';

/**
 * - 이미지 업로드
 */
export async function uploadImageFn(
  file: File,
  alt: string,
): Promise<{ imageUrl: string; imageAlt: string; imageIdx: number } | void> {
  const { name, size } = file;

  if (size > 3 * 1024 * 1024)
    return alert('이미지는 3MB 이하만 업로드 가능합니다.');
  // eslint-disable-next-line no-useless-escape
  if (!/^[A-Za-z0-9-_\.]+$/.test(name))
    return alert('파일명은 영어만 업로드 가능합니다.');

  try {
    const duplicatedImgDataRes = await axios.get('/apis/images', {
      params: { name, size },
    });

    let imageUrl, imageAlt, imageIdx;
    if (duplicatedImgDataRes.data.url) {
      //* 중복된 이미지 사용
      imageUrl = duplicatedImgDataRes.data.url;
      imageAlt = duplicatedImgDataRes.data.alt;
      imageIdx = duplicatedImgDataRes.data.idx;
      alert('중복된 이미지가 있어 정보를 불러옵니다.');
    } else {
      //* 이미지 업로드
      const formData = new FormData();
      formData.append('image', file);
      formData.append('alt', alt);
      formData.append('checkToken', 'true');

      const imageData = await axios.post('/apis/images', formData);
      imageUrl = imageData.data.url;
      imageIdx = imageData.data.idx;
      imageAlt = imageData.data.alt;
    }
    return { imageUrl, imageAlt, imageIdx };
  } catch (err) {
    if (isAxiosCustomError(err)) {
      alert(err.data.message);
    } else {
      console.error(err);
    }
  }
}
