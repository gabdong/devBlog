import express from 'express';

import tagsAPI from '@apis/tags';
import authsAPI from '@apis/auths';
import postsAPI from '@apis/posts';
import imagesAPI from '@apis/images';

const router = express.Router();

router.use('/tags', tagsAPI);
router.use('/auths', authsAPI);
router.use('/posts', postsAPI);
router.use('/images', imagesAPI);

export default router;
