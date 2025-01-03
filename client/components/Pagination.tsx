import styled from 'styled-components';
import Link from 'next/link';
import React from 'react';
import {
  BsChevronRight as Next,
  BsChevronLeft as Prev,
  BsChevronDoubleLeft as FirstPage,
  BsChevronDoubleRight as LastPage,
} from 'react-icons/bs';
import LinkButton from './LinkButton';

interface PaginationProps {
  totalCnt: number;
  page: number;
  paginationCnt: number; // 페이지네이션 그룹 아이템 갯수
  path: string;
  limit: number;
}

function Pagination({
  totalCnt,
  page,
  paginationCnt = 10,
  path,
  limit = 10,
}: PaginationProps) {
  if (totalCnt <= limit) return null; // 컨텐츠 총갯수가 limit보다 작을경우 출력 x

  const groupCnt = Math.ceil(totalCnt / limit / paginationCnt); // 그룹 총갯수
  const currentGroup = Math.ceil(page / paginationCnt); // 현재 그룹
  const nextGroup = currentGroup + 1 > groupCnt ? groupCnt : currentGroup + 1; // 다음 그룹
  const prevGroup = currentGroup - 1 < 1 ? 1 : currentGroup - 1; // 이전그룹
  const startNum = currentGroup * paginationCnt - (paginationCnt - 1); // 페이지네이션 현재그룹 시작번호
  const lastNum = Math.ceil(totalCnt / limit); // 페이지네이션 마지막번호
  const prevPageStartNum = prevGroup * paginationCnt - (paginationCnt - 1); // 이전그룹 시작번호
  const nextPageStartNum = nextGroup * paginationCnt - (paginationCnt - 1); // 다음그룹 시작번호

  // 페이지네이션 길이(갯수)
  let paginationLength = paginationCnt;
  if (startNum + paginationLength > lastNum)
    paginationLength = lastNum - startNum + 1;

  //* 화살표 버튼 사용여부
  const firstPageBtnUsing = page !== 1 ? true : false;
  const lastPageBtnUsing = page !== lastNum ? true : false;
  const prevArrowUsing = page > 1 && prevPageStartNum > 1 ? true : false;
  const nextArrowUsing =
    page < lastNum && nextGroup !== groupCnt ? true : false;

  return (
    <PaginationSt>
      {firstPageBtnUsing ? ( //* 첫번째 페이지
        <Link href={`${path}?page=1`}>
          <FirstPage />
        </Link>
      ) : null}

      {prevArrowUsing ? ( //* 이전페이지그룹
        <Link href={`${path}?page=${prevPageStartNum}`}>
          <Prev />
        </Link>
      ) : null}

      {/* //* 페이지 */}
      {Array.from({ length: paginationLength }).map((a, i) => {
        const pageNum = startNum + i;

        return (
          <LinkButton
            key={pageNum}
            text={String(pageNum)}
            href={`${path}?page=${pageNum}`}
            className={[page === pageNum ? 'active' : '']}
            theme="none"
          />
        );
      })}

      {nextArrowUsing ? ( //* 다음페이지그룹
        <Link
          href={`${path}?page=${nextPageStartNum > lastNum ? lastNum : nextPageStartNum}`}
        >
          <Next />
        </Link>
      ) : null}

      {lastPageBtnUsing ? ( //* 마지막페이지
        <Link href={`${path}?page=${lastNum}`}>
          <LastPage />
        </Link>
      ) : null}
    </PaginationSt>
  );
}

const PaginationSt = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  padding: 20px 0;

  & > a {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;
  }
`;

export default React.memo(Pagination);
