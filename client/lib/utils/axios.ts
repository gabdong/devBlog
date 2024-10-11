import axios, { AxiosInstance } from 'axios';

export const instance: AxiosInstance = axios.create({
  timeout: 10000,
  withCredentials: true, // CORS 요청 허용
});
