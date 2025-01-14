import express from 'express';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import {
  buildErrorMessage,
  getCurrentLine,
  getDbResult,
  getDbResultArr,
  buildQueryPlaceholder,
} from '@utils/utils';

const CURRENT_FILE = 'POST';
const router = express.Router();

//- 게시글 업로드
router.post(
  '/',
  asyncErrorHandler(async (req, res) => {
    const {
      postData: { subject, content, subtitle, tagNameData, thumbnailIdx },
      isPublic,
      userData,
    }: {
      postData: {
        subject: string;
        content: string;
        subtitle: string;
        thumbnailIdx: number;
        tagNameData: string[];
      };
      isPublic: 'Y' | 'N';
      userData: UserState;
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

    if (tagNameData.length === 0 && isPublic == 'Y') {
      throw new CustomError(
        buildErrorMessage(
          '태그정보가 없으면 공개로 저장할수 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
    }

    //* 저장할 태그정보
    const saveTagData: number[] = [];
    if (tagNameData.length > 0) {
      //* 기존 태그정보
      const getTagDataPlaceholder = buildQueryPlaceholder(tagNameData);
      const getTagDataRes = await req.dbQuery(
        `
        SELECT * 
        FROM tags 
        WHERE name IN (${getTagDataPlaceholder})
      `,
        tagNameData,
        buildErrorMessage(
          '태그 정보를 불러오지 못했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const getTagDataResult: TagData[] = getDbResultArr(getTagDataRes);

      const addTagNameList = tagNameData.filter((name) => {
        const match = getTagDataResult.find((item) => item.name === name);
        if (match) {
          saveTagData.push(match.idx);
          return false;
        }

        return true;
      });

      //* 기존에 없던 태그 추가
      if (addTagNameList.length > 0) {
        for (const name of addTagNameList) {
          const insertTagRes = await req.dbQuery(
            'INSERT INTO tags SET name=?, member=?',
            [name, userData.idx],
            buildErrorMessage(
              '태그를 저장하지 못했습니다.',
              CURRENT_FILE,
              getCurrentLine(),
            ),
            500,
          );
          const insertTagData = insertTagRes[0];
          const { insertId: tagIdx } = insertTagData;

          saveTagData.push(tagIdx);
        }
      }
    }

    const { idx: userIdx } = userData;

    const insertPostRes = await req.dbQuery(
      'INSERT INTO posts SET subject=?, subtitle=?, content=?, public=?, member=?, auth=0, tags=?, thumbnail=?',
      [
        subject,
        subtitle,
        content,
        isPublic,
        userIdx,
        JSON.stringify(saveTagData),
        thumbnailIdx,
      ],
      buildErrorMessage(
        '게시글 등록을 실패했습니다.',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );
    const insertPostData = insertPostRes[0];
    const { insertId: postIdx } = insertPostData;

    res.json({ postIdx });
  }),
);

//- 게시글 수정
router.put(
  '/:postIdx',
  asyncErrorHandler(async (req, res) => {
    const {
      postData: { subject, content, subtitle, tagNameData, thumbnailIdx },
      isPublic,
      userData,
    }: {
      postData: {
        subject: string;
        content: string;
        subtitle: string;
        thumbnailIdx: number;
        tagNameData: string[];
      };
      isPublic: 'Y' | 'N';
      userData: UserState;
    } = req.body;
    const { postIdx } = req.params;

    if (!userData.isLogin)
      throw new CustomError(
        buildErrorMessage(
          '회원정보가 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        401,
      );

    if (tagNameData.length === 0 && isPublic == 'Y') {
      throw new CustomError(
        buildErrorMessage(
          '태그정보가 없으면 공개로 저장할수 없습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
    }

    //* 저장할 태그정보
    const saveTagData: number[] = [];
    if (tagNameData.length > 0) {
      //* 기존 태그정보
      const getTagDataPlaceholder = buildQueryPlaceholder(tagNameData);
      const getTagDataRes = await req.dbQuery(
        `
        SELECT * 
        FROM tags 
        WHERE name IN (${getTagDataPlaceholder})
      `,
        tagNameData,
        buildErrorMessage(
          '태그 정보를 불러오지 못했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const getTagDataResult: TagData[] = getDbResultArr(getTagDataRes);

      const addTagNameList = tagNameData.filter((name) => {
        const match = getTagDataResult.find((item) => item.name === name);
        if (match) {
          saveTagData.push(match.idx);
          return false;
        }

        return true;
      });

      //* 기존에 없던 태그 추가
      if (addTagNameList.length > 0) {
        for (const name of addTagNameList) {
          const insertTagRes = await req.dbQuery(
            'INSERT INTO tags SET name=?, member=?',
            [name, userData.idx],
            buildErrorMessage(
              '태그를 저장하지 못했습니다.',
              CURRENT_FILE,
              getCurrentLine(),
            ),
            500,
          );
          const insertTagData = insertTagRes[0];
          const { insertId: tagIdx } = insertTagData;

          saveTagData.push(tagIdx);
        }
      }
    }

    const { idx: userIdx } = userData;

    const updatePostRes = await req.dbQuery(
      'UPDATE posts SET subject=?, subtitle=?, content=?, public=?, member=?, auth=0, tags=?, thumbnail=? WHERE idx=?',
      [
        subject,
        subtitle,
        content,
        isPublic,
        userIdx,
        JSON.stringify(saveTagData),
        thumbnailIdx,
        postIdx,
      ],
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
    const { limit, paginationUsing, userData, search } = req.body;
    const { tagIdx } = req.params;
    const { page } = req.query;
    const offset = (Number(page) - 1) * limit;

    //* SQL 조건
    let getPostListSqlCond = '';
    if (tagIdx === 'private') {
      if (userData.auth < 2) {
        throw new CustomError(
          buildErrorMessage(
            '접근 권한이 없습니다.',
            CURRENT_FILE,
            getCurrentLine(),
          ),
          401,
        );
      }

      getPostListSqlCond = " AND posts.public='N'";
    } else {
      getPostListSqlCond = " AND posts.public='Y'";

      // 태그선택시
      if (tagIdx !== 'latest' && tagIdx !== 'total' && tagIdx !== 'search')
        getPostListSqlCond += ` AND JSON_CONTAINS(posts.tags, '${tagIdx}')`;

      // 검색어 있을때
      if (search) getPostListSqlCond += ` AND subject LIKE ?`;
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
        [userData.auth, `%${search}%`],
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
      SELECT posts.idx, posts.subject, posts.subtitle, posts.content, posts.datetime, posts.tags, images.url AS thumbnailUrl, images.alt AS thumbnailAlt
      FROM posts posts
      LEFT JOIN images images
        ON images.idx=posts.thumbnail 
      WHERE posts.delete_datetime IS NULL 
      AND posts.auth<=?
      ${getPostListSqlCond}
      `,
      [userData.auth, `%${search}%`],
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
        images.url AS thumbnailUrl, 
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

    //
    postData.tagNameData = [];
    if (postData.tags.length > 0) {
      const placeholder = buildQueryPlaceholder(postData.tags);
      const getTagNameRes = await req.dbQuery(
        `
        SELECT name FROM tags WHERE idx IN (${placeholder})
        `,
        postData.tags,
        buildErrorMessage(
          '태그 정보를 불러오지 못했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
      const tagNameData: { name: string }[] = getDbResultArr(getTagNameRes);

      postData.tagNameData = tagNameData.map((data) => data.name);
    }

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
