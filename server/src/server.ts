import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import apis from '@apis';
import dbConnection from '@middlewares/db.middleware';

dotenv.config();

const PORT = Number(process.env.port);
const app = express();

app.use(dbConnection);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    credentials: false, // 다른 도메인간 쿠키공유 허용여부
    origin: '*', //TODO 허용할 도메인으로 변경
  }),
);
app.use('/apis', apis);

app.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
