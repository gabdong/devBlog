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
};

type UserState = {
  name: string;
};

//TODO 모달 한번에 여러개 띄워야할경우 array로 변경
type ModalState = {
  type: string;
  props?: object;
};
