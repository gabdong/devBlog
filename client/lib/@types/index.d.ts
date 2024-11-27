type CustomAxiosError = {
  status: number;
  statusText: string;
  data: {
    message: string;
    errorAlert: boolean;
  };
};

type PageProps = {
  userData?: UserState;
  pathName?: string;
};

type UserState = {
  name: string;
  isLogin: boolean;
  auth: number;
  birth: string;
  datetime: string;
  id: string;
  phone: string;
  updateDatetime: string;
  email: string;
};

//TODO 모달 한번에 여러개 띄워야할경우 array로 변경
type ModalState = {
  type: string;
  props?: object;
};
