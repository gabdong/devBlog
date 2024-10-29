import express from 'express';

import tagsAPI from '@apis/tags';
import authsAPI from '@apis/auths';

const router = express.Router();

router.use('/tags', tagsAPI);
router.use('/auths', authsAPI);

export default router;
