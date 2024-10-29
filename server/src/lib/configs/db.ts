import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: Number(DB_PORT),
  connectionLimit: 10,
  waitForConnections: true,
});

export default pool;
