import express from 'express';

import { asyncErrorHandler } from '@middlewares/errorHandler';
import { CustomError } from '@utils/customError';
import { buildErrorMessage, getCurrentLine, getDbResult } from '@utils/utils';
import imageUploader from '@utils/imageUploader';

const CURRENT_FILE = 'IMAGE';
const router = express.Router();

//- 중복된 이미지 확인
router.get(
  '/',
  asyncErrorHandler(async (req, res) => {
    const { name, size } = req.query;

    const duplicatedImgRes = await req.dbQuery(
      `
        SELECT url, alt, idx 
        FROM images 
        WHERE original_name=? 
        AND size=? 
      `,
      [name, size],
      buildErrorMessage(
        '중복된 이미지 검사를 실패했습니다',
        CURRENT_FILE,
        getCurrentLine(),
      ),
      500,
    );

    let url, alt, idx;
    const duplicatedImageResult = getDbResult(duplicatedImgRes);
    if (duplicatedImageResult) {
      url = duplicatedImageResult.url;
      alt = duplicatedImageResult.alt;
      idx = duplicatedImageResult.idx;
    }

    res.json({ url, alt, idx });
  }),
);

//- 이미지 추가
router.post(
  '/',
  imageUploader.single('image'),
  asyncErrorHandler(async (req, res) => {
    if (!req.file) {
      throw new CustomError(
        buildErrorMessage(
          '이미지 업로드를 실패했습니다.',
          CURRENT_FILE,
          getCurrentLine(),
        ),
        500,
      );
    }

    const { userData: userDataStr, alt } = req.body;
    const userData = JSON.parse(userDataStr);
    const uploadFileData = req.file as Express.Multer.File & {
      location: string;
      key: string;
    };
    const { originalname, size, mimetype, location: url, key } = uploadFileData;
    const name = key.replace('images/', '');

    let mimetypeNum;
    switch (mimetype) {
      case 'image/jpeg':
        mimetypeNum = 1;
        break;
      case 'image/png':
        mimetypeNum = 2;
        break;
    }

    const insertImageRes = await req.dbQuery(
      `
      INSERT INTO images SET
      member=?,
      size=?,
      original_name=?,
      name=?,
      url=?,
      alt=?,
      mime_type=?
    `,
      [userData.idx, size, originalname, name, url, alt, mimetypeNum],
    );

    const insertImageData = insertImageRes[0];
    const { insertId: idx } = insertImageData;

    res.json({ idx, url, alt });
  }),
);

export default router;
