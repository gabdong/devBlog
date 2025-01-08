import axios, { isAxiosCustomError } from '@utils/axios';
import { NextRouter } from 'next/router';

/**
 * - 게시글 리스트 요청
 * SSR에서만 사용
 */
export async function getPostList(
  tagIdx: number | 'latest' | 'private' | 'total',
  page: number,
  limit: number,
  paginationUsing: boolean,
  userData: UserState,
): Promise<{ postList: PostData[]; totalCnt: number }> {
  try {
    const payload = { limit, paginationUsing, userData };

    const getPostListRes = await axios.get(
      `/apis/posts/list/${tagIdx}/?page=${page}`,
      {
        data: payload,
      },
    );
    const { postList, totalCnt } = getPostListRes.data;

    return { postList, totalCnt };
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.log(err);
    }

    return { postList: [], totalCnt: 0 };
  }
}
/**
 * - 게시글 요청
 * SSR에서만 사용
 */
export async function getPost(
  postIdx: number,
  userData: UserState,
): Promise<PostData> {
  try {
    const getPostRes = await axios.get(`/apis/posts/${postIdx}`, {
      data: { userData },
    });
    const { postData } = getPostRes.data;

    return postData;
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.error(err);
    }

    throw err;
  }
}

/**
 * - 게시글 삭제
 */
export async function deletePost(postIdx: number, router: NextRouter) {
  if (!window.confirm('게시글 삭제를 진행하시겠습니까?')) return;

  try {
    await axios.delete(`/apis/posts/${postIdx}`);

    router.push('/');
  } catch (err) {
    if (isAxiosCustomError(err)) {
      alert(err.data.message);
    } else {
      console.error(err);
    }
  }
}

/**
 * - 게시글 업로드
 */
export async function uploadPost(
  isPublic: string,
  postData: PostData,
  router: NextRouter,
) {
  //TODO 썸네일
  // if (postData.uploadThumbnail) {
  //   // 썸네일 업로드
  //   const { uploadThumbnail, thumbnailAlt } = postData;

  //   try {
  //     const uploadThumbnailRes = await uploadImage(
  //       uploadThumbnail,
  //       thumbnailAlt,
  //     );
  //     const thumbnail = uploadThumbnailRes.idx;
  //     postData.thumbnail = thumbnail;
  //   } catch (err) {
  //     if (err.response?.data.msg) console.error(err.response.data.msg);
  //   }
  // }

  //* 태그없을경우 비공개
  if (
    !postData.tagNameData ||
    (postData.tagNameData &&
      postData.tagNameData.length === 0 &&
      isPublic == 'Y')
  ) {
    if (!confirm('태그가 설정되어있지 않습니다. 비공개로 저장하시겠습니까?'))
      return;

    isPublic = 'N';
  }

  //* 필수 입력 확인
  if (!postData.subject) return alert('제목을 입력해주세요.');
  if (!postData.subtitle) return alert('부제목을 입력해주세요.');
  if (!postData.content) return alert('내용을 입력해주세요.');

  try {
    const uploadPostRes = await axios.post('/apis/posts', {
      checkToken: true,
      postData,
      isPublic,
    });

    const {
      data: { postIdx },
    } = uploadPostRes;

    router.push(`/post/${postIdx}`);
  } catch (err) {
    if (isAxiosCustomError(err)) {
      alert(err.data.message);
      console.error(err.data.message);
    } else {
      console.error(err);
    }
  }
}

/**
 * - 게시글 수정
 */
export async function editPost(
  postIdx: number,
  isPublic: string,
  postData: PostData,
  router: NextRouter,
) {
  // if (postData.uploadThumbnail) {
  //   // 썸네일 업로드
  //   const { uploadThumbnail, thumbnailAlt } = postData;

  //   try {
  //     const uploadThumbnailRes = await uploadImage(
  //       uploadThumbnail,
  //       thumbnailAlt,
  //     );
  //     const thumbnail = uploadThumbnailRes.idx;

  //     postData.thumbnail = thumbnail;
  //   } catch (err) {
  //     if (err.response?.data.msg) console.error(err.response.data.msg);
  //   }
  // }

  //* 태그없을경우 비공개
  if (
    !postData.tagNameData ||
    (postData.tagNameData &&
      postData.tagNameData.length === 0 &&
      isPublic == 'Y')
  ) {
    if (!confirm('태그가 설정되어있지 않습니다. 비공개로 저장하시겠습니까?'))
      return;

    isPublic = 'N';
  }

  if (!postData.subject) return alert('제목을 입력해주세요.');
  if (!postData.subtitle) return alert('부제목을 입력해주세요.');
  if (!postData.content) return alert('내용을 입력해주세요.');

  try {
    await axios.put(`/apis/posts/${postIdx}`, {
      checkToken: true,
      postData,
      isPublic,
    });

    router.push(`/post/${postIdx}`);
  } catch (err) {
    if (isAxiosCustomError(err)) {
      alert(err.data.message);
      console.error(err.data.message);
    } else {
      console.error(err);
    }
  }
}
