import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';
import apis from './apis';

dotenv.config();

const PORT: number = Number(process.env.port) || 9411;
const app = express();

app.use(cors());
app.use('/apis', apis);

app.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
