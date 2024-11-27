// eslint-disable-next-line @typescript-eslint/no-unused-vars
import InternalAxiosRequestConfig from 'axios';

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface InternalAxiosRequestConfig<D = any> {
    userData?: UserState;
  }
}
