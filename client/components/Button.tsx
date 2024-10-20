import { MouseEventHandler } from 'react';
import styled from 'styled-components';

import { makeClassName } from '@/lib/utils/utils';

export default function Button({
  text,
  event,
  className,
  theme,
}: {
  text: string;
  event?: MouseEventHandler<HTMLButtonElement>;
  className?: string[];
  theme: string;
}): JSX.Element {
  return (
    <ButtonSt
      className={
        Array.isArray(className) ? makeClassName([...className, theme]) : theme
      }
      onClick={event}
    >
      <span>{text}</span>
    </ButtonSt>
  );
}

const ButtonSt = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30px;
  padding: 0 14px;
  border-radius: 15px;
  transition: var(--transition);

  &.background {
    background: var(--gray);

    &:hover {
      background: var(--primary-color);
    }
    & span {
      color: #ffffff;
    }
  }

  &.border {
    border: 1px solid var(--gray);
    background: none;

    &:hover {
      border: 1px solid var(--primary-color);
    }
  }
`;
