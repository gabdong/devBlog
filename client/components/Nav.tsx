import styled from 'styled-components';
import Image from 'next/image';
// import { BsFillGearFill } from 'react-icons/bs';

import xBtn from '@public/images/x_btn.png';
import searchIcon from '@public/images/search_icon.png';

import LinkButton from '@components/LinkButton';
import { useRouter } from 'next/router';

interface NavProps extends PageProps {
  tagList: TagData[];
  query: { tagIdx?: string };
  totalPostCnt: number;
  privatePostCnt: number;
}

/**
 * - mobile nav close
 */
const navClose = () => {
  const nav = document.getElementById('nav');
  const background = document.getElementById('navBackground');

  if (nav) nav.classList.remove('active');
  if (background) background.classList.remove('active');
};

export default function Nav({ userData, ...rest }: NavProps) {
  const router = useRouter();
  const { isLogin } = userData;
  const { tagList, query, totalPostCnt, privatePostCnt } = rest;
  const activeTagIdx = query.tagIdx
    ? query.tagIdx !== 'private' && query.tagIdx !== 'total'
      ? Number(query.tagIdx)
      : query.tagIdx
    : null;

  return (
    <>
      <NavBackgroundSt
        id="navBackground"
        className="mobileOnly"
        onClick={navClose}
      />
      <NavWrapSt id="nav" className="scroll">
        <CloseBtnSt className="mobileOnly" onClick={navClose}>
          <Image src={xBtn} alt="close button" />
        </CloseBtnSt>
        <SearchPostWrapSt>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const searchWord = input.value;

                if (searchWord) {
                  router.push(`/tag/search?search=${searchWord}&page=1`);
                } else {
                  router.push(`/tag/total?page=1`);
                }
              }
            }}
          />
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
            {/* //TODO 태그관리 */}
            {/* {isLogin && <BsFillGearFill />} */}
          </div>

          <TagListSt className="navTagList">
            <LinkButton
              text={`전체 (${totalPostCnt})`}
              href={`/tag/total?page=1`}
              theme="none"
              className={[activeTagIdx === 'total' ? 'active' : '']}
            />
            {isLogin && (
              <LinkButton
                text={`비공개 (${privatePostCnt})`}
                href={`/tag/private?page=1`}
                theme="none"
                className={[activeTagIdx === 'private' ? 'active' : '']}
              />
            )}
            {tagList.map((data) => {
              if (data.postCnt === 0) return null;
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
    </>
  );
}
const NavBackgroundSt = styled.div`
  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    display: none;

    &.active {
      display: block;

      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 31;
    }
  }
`;
const NavWrapSt = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 30px;

  width: var(--nav-width);
  padding: 20px;
  border-right: 0.5px solid var(--primary-color);
  overflow-y: auto;

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    width: 50%;
    height: 100%;
    padding: 60px 20px 20px 20px;
    background: rgba(0, 0, 0, 0.8);
    overflow-y: auto;
    position: fixed;
    left: -80%;
    top: 0;
    z-index: 32;
    transition: var(--transition);

    &::-webkit-scrollbar {
      width: 3px;
      background: var(--dark-l);
      border-radius: var(--border-radius);
    }
    &::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: var(--border-radius);
    }

    &.active {
      left: 0;
    }
  }
`;
const CloseBtnSt = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;

  img {
    width: 24px;
    height: 24px;
  }
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
  position: relative;

  & input {
    font-size: 12px;
  }

  & img {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
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
