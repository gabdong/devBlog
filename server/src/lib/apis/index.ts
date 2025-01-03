import express from 'express';

import tagsAPI from '@apis/tags';
import authsAPI from '@apis/auths';
import postAPI from '@apis/posts';

const router = express.Router();

router.use('/tags', tagsAPI);
router.use('/auths', authsAPI);
router.use('/posts', postAPI);

export default router;
