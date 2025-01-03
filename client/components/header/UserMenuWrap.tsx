import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { removeToken } from '@utils/auth';

/**
 * - 로그인했을경우 이름영역 클릭시 보이는 드롭다운
 */
export default function UserMenuWrap({
  setViewState,
}: {
  setViewState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  /**
   * * userMenuWrap 이외영역 클릭시 userMenuWrap 닫기
   */
  const closeUserMenuWrap = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      !target.closest('.headerUserBtnWrap') ||
      target.classList.contains('.menuWrapBtn') ||
      target.closest('.menuWrapBtn')
    ) {
      setViewState(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeUserMenuWrap);

    return () => {
      window.removeEventListener('click', closeUserMenuWrap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * - logout
   */
  const logoutFn = async () => {
    await removeToken();
    router.reload();
  };

  return (
    <UserMenuWrapSt id="userMenuWrap">
      {/* //TODO */}
      <li className="menuWrapBtn normalText" onClick={logoutFn}>
        MyPage
      </li>
      <li className="menuWrapBtn normalText" onClick={logoutFn}>
        Logout
      </li>
    </UserMenuWrapSt>
  );
}

const UserMenuWrapSt = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: var(--box-padding);
  background: var(--dark-l);
  border-radius: var(--border-radius);

  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 1;

  & > li {
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: var(--transition);
  }

  & > li:hover {
    color: var(--primary-color);
  }

  @media all and (max-width: 767px) {
    top: calc(100% + 10px);
  }
`;
