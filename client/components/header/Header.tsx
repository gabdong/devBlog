import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsJustify } from 'react-icons/bs';
import { MouseEvent, useState } from 'react';

import useModal from '@hooks/useModal';

import whiteLogo from '@public/images/logo_white.png';
import colorLogo from '@public/images/logo_color.png';
import Button from '@components/Button';
import UserMenuWrap from '@components/header/UserMenuWrap';
import LinkButton from '@components/LinkButton';

interface HeaderProps extends PageProps {
  query: { tab?: string };
}

/**
 * - mobile nav open
 */
const navOpen = () => {
  const nav = document.getElementById('nav');
  const background = document.getElementById('navBackground');

  if (nav) nav.classList.add('active');
  if (background) background.classList.add('active');
};

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
      <NavIconSt className="mobileOnly" onClick={navOpen} />
      <LogoWrapSt className="logoWrap">
        <Link href="/">
          <LogoSt
            src={whiteLogo}
            alt="white logo"
            priority
            className="pcOnly logo"
          />
          <MobileLogoSt
            src={colorLogo}
            alt="color logo"
            priority
            className="mobileOnly logo"
          />
        </Link>
      </LogoWrapSt>
      <HeaderContentWrapSt>
        <div className="headerTabButtonWrap">
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
          {/* //TODO 테마변경기능 */}
          {/* <span>테마</span> */}
          {userData.isLogin && (
            <LinkButton
              href="/editor/new"
              text="글작성"
              className={['writePostBtn']}
            />
          )}
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

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    justify-content: space-between;

    padding: 0 20px;
    position: relative;

    & .logoWrap {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
const NavIconSt = styled(BsJustify)`
  font-size: 24px;
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

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    width: auto;
    background: none;
  }
`;
const LogoSt = styled(Image)`
  width: 50%;
  height: auto;
`;
const MobileLogoSt = styled(Image)`
  width: 50%;
  height: auto;
`;
const HeaderContentWrapSt = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0 20px;

  & > div {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  & .headerTabButtonWrap,
  & .writePostBtn {
    @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
      display: none;
    }
  }

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    justify-content: end;

    padding: 0;
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
