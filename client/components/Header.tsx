import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { setName } from '@redux/slices/user';
import useModal from '@hooks/useModal';

import whiteLogo from '@public/images/logo_white.png';
import Button from '@components/Button';

export default function Header({
  pathName,
}: {
  pathName: string;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { openModal } = useModal();

  const getLoginModal = () => {
    openModal({ type: 'login' });
  };

  return (
    <HeaderWrapSt id="header">
      <LogoWrapSt>
        <Link href="/">
          <LogoSt src={whiteLogo} alt="white logo" priority />
        </Link>
      </LogoWrapSt>
      <HeaderContentWrapSt>
        <div>
          <HeaderTabButtonSt
            className={
              pathName == '/about_me' || pathName == '/' ? 'active' : ''
            }
            href="/about_me/?tab=about_me"
          >
            About Me
          </HeaderTabButtonSt>
          <HeaderTabButtonSt
            className={pathName == '/post' ? 'active' : ''}
            href="/post/?tab=latest_content"
          >
            최근게시물
          </HeaderTabButtonSt>
        </div>
        <div>
          <span>테마</span>
          <span
            onClick={() => {
              console.log(user);
            }}
          >
            테스트
          </span>
          <span onClick={() => dispatch(setName({ name: '김동환' }))}>
            테스트2
          </span>
          <Button text="Login" event={getLoginModal} theme="background" />
        </div>
      </HeaderContentWrapSt>
    </HeaderWrapSt>
  );
}

const HeaderWrapSt = styled.header`
  display: flex;
  align-items: center;

  width: 100%;
  height: var(--header-height);
  border-bottom: 0.5px solid var(--primary-color);
`;
const LogoWrapSt = styled.div`
  width: var(--nav-width);
  height: 100%;
  background: var(--primary-color);

  & a {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  }
`;
const LogoSt = styled(Image)`
  width: 50%;
  height: auto;
`;
const HeaderContentWrapSt = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;

  & div {
    display: flex;
    align-items: center;
    gap: 20px;

    padding: 20px;
  }
`;
const HeaderTabButtonSt = styled(Link)`
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);

  &.active {
    color: var(--primary-color);
    border-bottom: 0.5px solid var(--primary-color);
  }

  &:hover {
    color: var(--primary-color);
  }
`;
