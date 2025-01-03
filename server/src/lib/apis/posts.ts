import express from 'express';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import {
  buildErrorMessage,
  getCurrentLine,
  getDbResult,
  getDbResultArr,
} from '@utils/utils';

const CURRENT_FILE = 'POST';
const router = express.Router();

//- 게시글 업로드
//TODO 태그없을경우 비공개
router.post(
  '/',
  asyncErrorHandler(async (req, res) => {
    const {
      postData: { subject, content, subtitle },
      isPublic,
      userData,
    } = req.body;

    if (!userData.isLogin)
      throw new CustomError(
        buildErrorMessage(
          '회원정보가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        401,
      );

    const { idx: userIdx } = userData;

    //TODO 태그 추가
    const insertPostRes = await req.dbQuery(
      'INSERT INTO posts SET subject=?, subtitle=?, content=?, public=?, member=?, auth=0, tags=?',
      [subject, subtitle, content, isPublic, userIdx, '[]'],
      buildErrorMessage(
        '게시글 등록을 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
    );
    const insertPostData = insertPostRes[0];
    const { insertId: postIdx } = insertPostData;

    res.json({ postIdx });
  }),
);

//- 게시글 수정
//TODO 태그없을경우 비공개
router.put(
  '/:postIdx',
  asyncErrorHandler(async (req, res) => {
    const {
      postData: { subject, content, subtitle },
      isPublic,
      userData,
    } = req.body;
    const { postIdx } = req.params;
    console.log(req.params);

    if (!userData.isLogin)
      throw new CustomError(
        buildErrorMessage(
          '회원정보가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        401,
      );

    const { idx: userIdx } = userData;

    //TODO 태그 추가
    const updatePostRes = await req.dbQuery(
      'UPDATE posts SET subject=?, subtitle=?, content=?, public=?, member=?, auth=0, tags=? WHERE idx=?',
      [subject, subtitle, content, isPublic, userIdx, '[]', postIdx],
      buildErrorMessage(
        '게시글 수정을 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
    );

    const { affectedRows } = updatePostRes[0];
    if (affectedRows !== 1)
      throw new CustomError(
        buildErrorMessage(
          '게시글 수정을 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );

    res.json({});
  }),
);

//- 게시글 리스트
router.get(
  '/list/:tagIdx',
  asyncErrorHandler(async (req, res) => {
    //TODO 검색어 추가
    const { limit, paginationUsing, userData } = req.body;
    const { tagIdx } = req.params;
    const { page } = req.query;
    const offset = (Number(page) - 1) * limit;

    //* SQL 조건
    let getPostListSqlCond = '';
    if (tagIdx === 'private') {
      getPostListSqlCond = " AND posts.public='N'";
    } else {
      getPostListSqlCond = " AND posts.public='Y'";

      // 태그선택시
      if (tagIdx !== 'latest' && tagIdx !== 'total')
        getPostListSqlCond += ` AND JSON_CONTAINS(posts.tags, '${tagIdx}')`;
    }
    getPostListSqlCond += ' ORDER BY posts.datetime DESC, posts.idx DESC ';

    //* 페이지네이션 사용시 총갯수 확인
    let totalCnt = 0;
    if (paginationUsing) {
      const totalCntRes = await req.dbQuery(
        `
        SELECT COUNT(idx) as totalCnt
        FROM posts
        WHERE delete_datetime IS NULL
        AND auth<=?
        ${getPostListSqlCond}
      `,
        [userData.auth],
        buildErrorMessage(
          '게시글 총 갯수 조회를 실패했습니다',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const totalCntData = getDbResult(totalCntRes);
      totalCnt = totalCntData.totalCnt;
    }
    getPostListSqlCond += `LIMIT ${limit} OFFSET ${offset}`;

    const getPostListRes = await req.dbQuery(
      `
      SELECT posts.idx, posts.subject, posts.subtitle, posts.content, posts.datetime, posts.tags, images.url AS thumbnail, images.alt AS thumbnailAlt
      FROM posts posts
      LEFT JOIN images images
        ON images.idx=posts.thumbnail 
      WHERE posts.delete_datetime IS NULL 
      AND posts.auth<=?
      ${getPostListSqlCond}
      `,
      [userData.auth],
      buildErrorMessage(
        '게시글 리스트 조회를 실패했습니다',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );
    const postList = getDbResultArr(getPostListRes);

    res.json({ postList, totalCnt });
  }),
);

//- 게시글 정보
router.get(
  '/:postIdx',
  asyncErrorHandler(async (req, res) => {
    const {
      params: { postIdx },
      body: { userData },
    } = req;

    const getPostDataRes = await req.dbQuery(
      `
      SELECT 
        posts.subject, posts.subtitle, posts.content, posts.tags, posts.public, posts.idx, posts.auth, 
        posts.member AS writerIdx, 
        posts.datetime AS datetime, 
        members.name AS memberName, 
        images.url AS thumbnail, 
        images.alt AS thumbnailAlt
      FROM posts posts 
      INNER JOIN members members 
        ON members.idx=posts.member
      LEFT JOIN images images 
        ON images.idx=posts.thumbnail 
      WHERE posts.idx=? 
      AND posts.delete_datetime IS NULL
      `,
      [postIdx],
      buildErrorMessage(
        '게시글 정보 조회를 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    const postData = getDbResult(
      getPostDataRes,
      buildErrorMessage(
        '게시글 정보를 찾을수 없습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      404,
    );

    //* 게시글 권한 검증
    if (
      (postData.public == 'N' && !userData.isLogin) ||
      postData.auth > userData.auth
    )
      throw new CustomError(
        buildErrorMessage('권한이 없습니다.', CURRENT_FILE, getCurrentLine()),
        401,
      );

    res.json({ postData });
  }),
);

//- 게시글 삭제
router.delete(
  '/:postIdx',
  asyncErrorHandler(async (req, res) => {
    const { postIdx } = req.params;

    if (!postIdx)
      throw new CustomError(
        buildErrorMessage(
          '게시글 번호가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );

    const updatePostRes = await req.dbQuery(
      'UPDATE posts SET delete_datetime=CURRENT_TIMESTAMP() WHERE idx=?',
      [postIdx],
    );
    const { affectedRows } = updatePostRes[0];

    if (affectedRows !== 1)
      throw new CustomError(
        buildErrorMessage(
          '게시글 삭제를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );

    res.json({});
  }),
);

export default router;
