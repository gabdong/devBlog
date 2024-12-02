import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import apis from '@apis';
import dbConnection from '@middlewares/db.middleware';
import dbQuery from '@middlewares/db.query';
import { errorHandler } from '@middlewares/errorHandler';

dotenv.config();

const PORT = Number(process.env.port);
const app = express();

app.use(dbConnection); // db config
app.use(dbQuery); // db excute
app.use(bodyParser.urlencoded({ extended: false })); // 중첩객체 허용여부
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true, // 다른 도메인간 쿠키공유 허용여부
    origin: 'http://localhost:3000', //TODO 허용할 도메인으로 변경
  }),
);
app.use('/lib/apis', apis);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
