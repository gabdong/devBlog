//- Axios error type
interface CustomAxiosError {
  status: number;
  statusText: string;
  data: {
    message: string;
  };
}

//- Page props type
interface PageProps {
  userData: UserState;
  pathName: string;
}

//- User data type
interface UserState {
  idx: number;
  name: string;
  isLogin: boolean;
  auth: number;
  birth: string;
  datetime: string;
  id: string;
  phone: string;
  updateDatetime: string;
  email: string;
}

//TODO 모달 한번에 여러개 띄워야할경우 array로 변경
//- Redux modal state type
interface ModalState {
  type: string;
  props?: object;
}

//- Post data type
interface PostData {
  idx?: number;
  subject: string;
  content: string;
  subtitle?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  datetime?: string;
  writerIdx?: number;
  memberName?: string;
  html?: string;
}

//- Editor props type
interface EditorProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  height: number;
}

//- Tag data type
interface TagData {
  idx: number;
  name: string;
  postCnt: number;
}

//- Input components props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  border?: 'all' | 'left' | 'right' | 'top' | 'bottom';
  style?: CSSProperties;
}
