import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
  const { id, pw } = req.body;
  console.log(id);
  console.log(pw);

  res.json({ result: 'SUCCESS' });
});

export default router;
