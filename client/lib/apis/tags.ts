import axios, { isAxiosCustomError } from '@utils/axios';

/**
 * - 태그 리스트 요청
 * SSR에서만 사용
 */
export const getTagList = async ({
  userData,
}: {
  userData: UserState;
}): Promise<{
  tagList: TagData[];
  totalPostCnt: number;
  privatePostCnt: number;
}> => {
  try {
    const getTagListRes = await axios.get('/apis/tags', {
      data: { userData },
    });
    const { tagList, totalPostCnt, privatePostCnt } = getTagListRes.data;

    return { tagList, totalPostCnt, privatePostCnt };
  } catch (err) {
    if (isAxiosCustomError(err)) {
      console.error(err.data.message);
    } else {
      console.error(err);
    }

    return { tagList: [], totalPostCnt: 0, privatePostCnt: 0 };
  }
};
