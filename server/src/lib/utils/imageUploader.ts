import s3 from '@configs/aws';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';
import { CustomError } from '@utils/customError';
import { buildErrorMessage, getCurrentLine } from './utils';

dotenv.config();

const CURRENT_FILE = 'IMAGE_UPLOADER';
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const extention = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(extention))
        throw new CustomError(
          buildErrorMessage(
            '잘못된 확장자입니다.',
            CURRENT_FILE,
            getCurrentLine(),
          ),
          415,
        );

      callback(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
});

export default imageUploader;
