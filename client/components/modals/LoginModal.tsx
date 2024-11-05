import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios, { isAxiosCustomError } from '@utils/axios';
import useInput from '@hooks/useInput';

import colorLogo from '@public/images/logo_color.png';
import Button from '@components/Button';

export default function LoginModal(): JSX.Element {
  const [id, idHandler] = useInput('test'); //TODO 기본값 지우기
  const [pw, pwHandler] = useInput('test'); //TODO 기본값 지우기
  const router = useRouter();

  const loginFn = async (): Promise<void> => {
    const btn: HTMLButtonElement = document.getElementById(
      'login_btn',
    ) as HTMLButtonElement;
    btn.disabled = true;

    if (!id) return alert('아이디를 입력해주세요.');
    if (!pw) return alert('패스워드를 입력해주세요.');

    try {
      await axios.post('/apis/auths/login', { id, pw });
      router.reload();
    } catch (err) {
      if (isAxiosCustomError(err)) {
        const {
          data: { message, errorAlert },
        } = err;
        if (errorAlert) alert(message);
      } else {
        console.error(err);
      }
    } finally {
      btn.disabled = false;
    }
  };

  return (
    <LoginModalSt className="modalContent">
      <LogoSt src={colorLogo} alt="color logo" />
      <LoginFromSt
        onSubmit={(e) => {
          e.preventDefault();
          loginFn();
        }}
      >
        <InputWrapSt>
          <input type="text" placeholder="ID" value={id} onChange={idHandler} />
          <input
            type="password"
            placeholder="PASSWORD"
            value={pw}
            onChange={pwHandler}
          />
          <AccountBtnWrapSt>
            <Link href="/">
              <span className="caption">Forgot your ID? Or Password?</span>
            </Link>
            <Link href="/">
              <span className="caption">Create Account</span>
            </Link>
          </AccountBtnWrapSt>
        </InputWrapSt>
        <Button
          text="LOGIN"
          theme="border"
          style={{ alignSelf: 'center' }}
          id="login_btn"
        />
      </LoginFromSt>
    </LoginModalSt>
  );
}

const LoginModalSt = styled.div`
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
const LoginFromSt = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
const InputWrapSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  width: 100%;

  & input {
    width: 100%;
    padding-bottom: 4px;
    border-bottom: 0.5px solid var(--gray-l-2);
    color: var(--gray-l);
  }
`;
const AccountBtnWrapSt = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
