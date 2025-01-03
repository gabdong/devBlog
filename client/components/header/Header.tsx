import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown } from 'react-icons/bs';
import { MouseEvent, useState } from 'react';

import useModal from '@hooks/useModal';

import whiteLogo from '@public/images/logo_white.png';
import Button from '@components/Button';
import UserMenuWrap from '@components/header/UserMenuWrap';
import LinkButton from '@components/LinkButton';

interface HeaderProps extends PageProps {
  query: { tab?: string };
}

export default function Header({
  pathName,
  query: { tab },
  userData,
}: HeaderProps) {
  const { openModal } = useModal();
  const [userMenuWrapView, setUserMenuWrapView] = useState(false);

  /**
   * - user menu wrap handler
   */
  const userMenuWrapHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUserMenuWrapView((prev) => !prev);
  };

  /**
   * - 로그인 모달
   */
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
              pathName === '/' && tab !== 'latest_content' ? 'active' : ''
            }
            href="/?tab=about_me"
          >
            About Me
          </HeaderTabButtonSt>
          <HeaderTabButtonSt
            className={
              pathName === '/' && tab === 'latest_content' ? 'active' : ''
            }
            href="/?tab=latest_content"
          >
            최근게시물
          </HeaderTabButtonSt>
        </div>

        <div>
          <span>테마</span>
          {userData.isLogin && <LinkButton href="/editor/new" text="글작성" />}
          {userData.isLogin ? (
            <div style={{ position: 'relative' }}>
              <Button
                text={`${userData.name} 님`}
                theme="none"
                icon={<BsChevronDown />}
                event={userMenuWrapHandler}
              ></Button>
              {userMenuWrapView && (
                <UserMenuWrap setViewState={setUserMenuWrapView} />
              )}
            </div>
          ) : (
            <Button text="Login" event={getLoginModal} theme="background" />
          )}
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

  & > div {
    display: flex;
    align-items: center;
    gap: 14px;

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
