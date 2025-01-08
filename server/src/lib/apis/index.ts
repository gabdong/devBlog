import express from 'express';

import tagsAPI from '@apis/tags';
import authsAPI from '@apis/auths';
import postAPI from '@apis/posts';
import imageAPI from '@apis/images';

const router = express.Router();

router.use('/tags', tagsAPI);
router.use('/auths', authsAPI);
router.use('/posts', postAPI);
router.use('/images', imageAPI);

export default router;
