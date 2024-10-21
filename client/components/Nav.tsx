import styled from 'styled-components';
import Image from 'next/image';

import searchIcon from '@public/images/search_icon.png';

export default function Nav(): JSX.Element {
  return (
    <NavWrapSt id="nav" className="scroll">
      <SearchPostWrapSt>
        <input type="text" placeholder="검색어를 입력하세요." />
        <Image
          className="pointer"
          src={searchIcon}
          alt="search icon"
          width={12}
        />
      </SearchPostWrapSt>
      <NavContainerSt>
        <h2 className="subTitle">태그 목록</h2>
      </NavContainerSt>
    </NavWrapSt>
  );
}

// function getServerSideProps() {}

const NavWrapSt = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 30px;

  width: var(--nav-width);
  padding: 20px;
  border-right: 0.5px solid var(--primary-color);
  overflow-y: auto;
`;
const SearchPostWrapSt = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  padding: 0px 14px;
  border-radius: 15px;
  border: 1px solid var(--gray);

  & input {
    font-size: 12px;
  }
`;
const NavContainerSt = styled.div`
  width: 100%;
  padding: 0 14px;

  & > .subTitle {
    padding-bottom: 3px;
    border-bottom: 0.5px solid var(--primary-color);
  }
`;
