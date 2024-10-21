import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent } from 'react';

import useInput from '@hooks/useInput';
import colorLogo from '@public/images/logo_color.png';
import Button from '@components/Button';

export default function LoginModal(): JSX.Element {
  const [id, idHandler] = useInput('');
  const [pw, pwHandler] = useInput('');

  const loginFn = async (
    e: MouseEvent<HTMLButtonElement>,
    args: string,
  ): Promise<void> => {
    console.log(args);
    const btn = e.currentTarget;

    console.log(btn);
  };

  return (
    <LoginModalSt className="modalContent">
      <LogoSt src={colorLogo} alt="color logo" />
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
        event={(e: MouseEvent<HTMLButtonElement>, test) => loginFn(e, test)}
        test="test"
      />
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
