import { styled } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

import whiteLogo from '../public/images/logo_white.png';
import Button from '@components/Button';

import { useAppSelector, useAppDispatch } from '@redux/hooks';
import { setName } from '@redux/slices/user';

function getLoginModal() {
  console.log('hi');
}

export default function Header({
  pathName,
}: {
  pathName: string;
}): JSX.Element {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <HeaderWrapSt id="header">
      <LogoWrapSt>
        <Link href="/">
          <LogoSt src={whiteLogo} alt="logo" />
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
          <span onClick={() => console.log(user)}>테스트</span>
          <span onClick={() => dispatch(setName('김동환'))}>테스트2</span>
          <Button
            text="Login"
            event={() => getLoginModal()}
            theme="background"
          />
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
