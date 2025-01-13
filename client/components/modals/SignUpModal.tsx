import styled from 'styled-components';
import Image from 'next/image';

import axios, { isAxiosCustomError } from '@utils/axios';
import useInput from '@hooks/useInput';
import useModal from '@hooks/useModal';

import colorLogo from '@public/images/logo_color.png';
import Button from '@components/Button';
import Input from '@components/Input';

//TODO 아이디 중복체크, 비밀번호확인
export default function SignUpModal(): JSX.Element {
  const { closeModal } = useModal();
  const [id, idHandler] = useInput('');
  const [pw, pwHandler] = useInput('');
  const [name, nameHandler] = useInput('');
  const [phone, phoneHandler] = useInput('');
  const [email, emailHandler] = useInput('');
  const [birth, birthHandler] = useInput('');

  /**
   * - 회원가입
   */
  const signUpFn = async (): Promise<void> => {
    const btn: HTMLButtonElement = document.getElementById(
      'signUpBtn',
    ) as HTMLButtonElement;
    btn.disabled = true;

    // id
    if (!/^[a-zA-Z0-9]*$/.test(id))
      return alert('아이디는 영어와 숫자만 입력해주세요.');
    if (id.length > 15) return alert('아이디는 15자 이내로 입력해주세요.');

    // pw
    // eslint-disable-next-line no-useless-escape
    if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/'`;~]*$/.test(id))
      return alert('비밀번호는 영어와 숫자, 특수문자만 입력해주세요.');
    if (pw.length > 15) return alert('비밀번호는 15자 이내로 입력해주세요.');

    // name
    if (name.length > 10) return alert('이름은 10자 이내로 입력해주세요.');

    // phone
    if (!/^010\d{8}$/.test(phone))
      return alert('올바른 휴대폰번호를 입력해주세요.');

    // email
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return alert('올바른 이메일을 입력해주세요.');

    // birth
    const year = parseInt(birth.slice(0, 4), 10);
    const month = parseInt(birth.slice(4, 6), 10);
    const day = parseInt(birth.slice(6, 8), 10);

    const date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    const today = new Date();

    if (
      date > today ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    )
      return alert('올바른 생일을 입력해주세요.');

    try {
      await axios.post('/apis/auths/signup', {
        id,
        pw,
        name,
        phone,
        email,
        birth,
      });

      alert('회원가입이 완료되었습니다.');
      closeModal();
    } catch (err) {
      if (isAxiosCustomError(err)) {
        alert(err.data.message);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <SignUpModalSt className="modalContent">
      <LogoSt src={colorLogo} alt="color logo" />
      <SignUpFormSt
        onSubmit={(e) => {
          e.preventDefault();
          signUpFn();
        }}
      >
        <InputWrapSt>
          <InputContainerSt>
            <span className="caption">아이디</span>
            <Input
              type="text"
              placeholder="영어 / 숫자만 입력 ( 15자 이내 )"
              defaultValue={id}
              onChange={idHandler}
              border="bottom"
              maxLength={15}
            />
          </InputContainerSt>
          <InputContainerSt>
            <span className="caption">비밀번호</span>
            <Input
              type="password"
              placeholder="영어 / 숫자 / 특수문자만 입력 ( 15자 이내 )"
              defaultValue={pw}
              onChange={pwHandler}
              maxLength={15}
              border="bottom"
            />
          </InputContainerSt>
          <InputContainerSt>
            <span className="caption">이름</span>
            <Input
              type="text"
              placeholder="이름"
              defaultValue={name}
              onChange={nameHandler}
              border="bottom"
              maxLength={10}
            />
          </InputContainerSt>
          <InputContainerSt>
            <span className="caption">휴대폰번호</span>
            <Input
              type="text"
              placeholder="숫자만 입력"
              defaultValue={phone}
              onChange={phoneHandler}
              border="bottom"
            />
          </InputContainerSt>
          <InputContainerSt>
            <span className="caption">이메일</span>
            <Input
              type="text"
              placeholder="이메일"
              defaultValue={email}
              onChange={emailHandler}
              border="bottom"
            />
          </InputContainerSt>
          <InputContainerSt>
            <span className="caption">생일</span>
            <Input
              type="text"
              placeholder="YYYYMMDD"
              defaultValue={birth}
              onChange={birthHandler}
              border="bottom"
            />
          </InputContainerSt>
        </InputWrapSt>
        <Button
          text="SignUp"
          theme="border"
          style={{ alignSelf: 'center' }}
          id="signUpBtn"
        />
      </SignUpFormSt>
    </SignUpModalSt>
  );
}

const SignUpModalSt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  width: 420px;
  max-width: 100%;
  padding: 30px;
`;
const LogoSt = styled(Image)`
  width: 140px;
  max-width: 50%;
  height: auto;
`;
const SignUpFormSt = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
const InputWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
`;
const InputContainerSt = styled.div`
  display: flex;
  flex-direction: column;

  & span {
    color: var(--gray-l);
  }
`;
