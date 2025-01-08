import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import axios, { isAxiosCustomError } from '@utils/axios';
import useInput from '@hooks/useInput';
import useModal from '@hooks/useModal';

import colorLogo from '@public/images/logo_color.png';

import Button from '@components/Button';
import Input from '@components/Input';

export default function LoginModal(): JSX.Element {
  const { openModal } = useModal();
  const [id, idHandler] = useInput('');
  const [pw, pwHandler] = useInput('');
  const router = useRouter();

  /**
   * - 로그인
   */
  const loginFn = async (): Promise<void> => {
    const btn: HTMLButtonElement = document.getElementById(
      'logInBtn',
    ) as HTMLButtonElement;
    btn.disabled = true;

    if (!id) return alert('아이디를 입력해주세요.');
    if (!pw) return alert('패스워드를 입력해주세요.');

    try {
      await axios.post('/apis/auths/login', {
        id,
        pw,
      });
      router.reload();
    } catch (err) {
      if (isAxiosCustomError(err)) {
        const {
          data: { message },
        } = err;
        alert(message);
      } else {
        console.error(err);
      }
    } finally {
      btn.disabled = false;
    }
  };

  /**
   * - 회원가입 모달
   */
  const getSignUpModal = () => {
    openModal({ type: 'signUp' });
  };

  return (
    <LoginModalSt className="modalContent">
      <LogoSt src={colorLogo} alt="color logo" />
      <LoginFormSt
        onSubmit={(e) => {
          e.preventDefault();
          loginFn();
        }}
      >
        <InputWrapSt>
          <Input
            type="text"
            placeholder="ID"
            defaultValue={id}
            onChange={idHandler}
            border="bottom"
          />
          <Input
            type="password"
            placeholder="PASSWORD"
            defaultValue={pw}
            onChange={pwHandler}
            border="bottom"
          />
          <AccountBtnWrapSt>
            {/* //TODO 아이디, 비밀번호찾기 */}
            {/* <Link href="/">
              <span className="caption">Forgot your ID or PW?</span>
            </Link> */}
            <span className="caption" onClick={getSignUpModal}>
              Create Account
            </span>
          </AccountBtnWrapSt>
        </InputWrapSt>
        <Button
          text="LOGIN"
          theme="border"
          style={{ alignSelf: 'center' }}
          id="logInBtn"
        />
      </LoginFormSt>
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
const LoginFormSt = styled.form`
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
`;
const AccountBtnWrapSt = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  & span {
    cursor: pointer;
  }
`;
