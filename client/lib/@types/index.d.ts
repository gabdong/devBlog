type CustomAxiosError = {
  status: number;
  statusText: string;
  data: {
    message: string;
  };
};
