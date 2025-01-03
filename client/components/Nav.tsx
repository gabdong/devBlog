import styled from 'styled-components';
import Image from 'next/image';
import { BsFillGearFill } from 'react-icons/bs';

import searchIcon from '@public/images/search_icon.png';
import LinkButton from '@components/LinkButton';

interface NavProps extends PageProps {
  tagList: TagData[];
  query: { tagIdx?: string };
  totalPostCnt: number;
  privatePostCnt: number;
}

export default function Nav({ userData, ...rest }: NavProps) {
  const { isLogin } = userData;
  const { tagList, query, totalPostCnt, privatePostCnt } = rest;
  const activeTagIdx = query.tagIdx
    ? query.tagIdx !== 'private' && query.tagIdx !== 'total'
      ? Number(query.tagIdx)
      : query.tagIdx
    : null;

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
        <div>
          <h2 className="subTitle">태그 목록</h2>
          {isLogin && <BsFillGearFill />}
        </div>

        <TagListSt className="navTagList">
          <LinkButton
            text={`전체 (${totalPostCnt})`}
            href={`/tag/total?page=1`}
            theme="none"
            className={[activeTagIdx === 'total' ? 'active' : '']}
          />
          {userData.isLogin && (
            <LinkButton
              text={`비공개 (${privatePostCnt})`}
              href={`/tag/private?page=1`}
              theme="none"
              className={[activeTagIdx === 'private' ? 'active' : '']}
            />
          )}
          {tagList.map((data) => {
            return (
              <LinkButton
                key={data.idx}
                text={`${data.name} (${data.postCnt})`}
                href={`/tag/${data.idx}?page=1`}
                theme="none"
                className={[data.idx === activeTagIdx ? 'active' : '']}
              />
            );
          })}
        </TagListSt>
      </NavContainerSt>
    </NavWrapSt>
  );
}

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
  min-height: 30px;
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

  & > div:not(.navTagList) {
    display: flex;
    justify-content: space-between;

    padding-bottom: 4px;
    border-bottom: 0.5px solid var(--primary-color);

    & svg {
      cursor: pointer;
      transition: var(--transition);
    }

    & svg:hover {
      color: var(--primary-color);
    }
  }
`;
const TagListSt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 10px 0;

  & > a {
    justify-content: start;
  }
`;
