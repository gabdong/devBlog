import { asyncErrorHandler } from '@middlewares/errorHandler';
import {
  buildErrorMessage,
  getCurrentLine,
  getDbResult,
  getDbResultArr,
} from '@utils/utils';
import express from 'express';

const CURRENT_FILE = 'TAG';
const router = express.Router();

//- 태그정보
router.get(
  '/',
  asyncErrorHandler(async (req, res) => {
    const { userData } = req.body;

    const tagListRes = await req.dbQuery(
      `
      SELECT tags.idx, tags.name, COUNT(posts.idx) AS postCnt  
      FROM tags tags
      LEFT JOIN posts posts 
        -- //* tag에 속하면서 삭제되지않고 공개인 게시글
        ON JSON_CONTAINS(posts.tags, CAST(tags.idx AS char)) 
        AND posts.delete_datetime IS NULL 
        AND posts.public='Y'
        AND posts.auth<=?
      WHERE tags.delete_datetime IS NULL
      GROUP BY tags.idx
      `,
      [userData.auth],
      buildErrorMessage(
        '태그리스트 조회를 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );
    const tagList = getDbResultArr(tagListRes);

    //* 전체 게시글, 비공개 게시글 갯수
    let privatePostCnt = 0;
    const privateCountSelect =
      userData.auth > 1
        ? ", COUNT(CASE WHEN public='N' AND auth<=? THEN 1 END) AS privatePostCnt"
        : '';
    const postCntRes = await req.dbQuery(
      `
      SELECT
        COUNT(CASE WHEN public='Y' AND auth<=? THEN 1 END) AS totalPostCnt
        ${privateCountSelect}
      FROM posts
      WHERE delete_datetime IS NULL
    `,
      [userData.auth, userData.auth],
      buildErrorMessage(
        '전체, 비공개 게시글 갯수 조회를 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    const postCntResult = getDbResult(postCntRes);
    const { totalPostCnt } = postCntResult;
    if (userData.auth > 1) privatePostCnt = postCntResult.privatePostCnt;

    res.json({ tagList, totalPostCnt, privatePostCnt });
  }),
);

export default router;
