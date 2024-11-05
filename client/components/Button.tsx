import { MouseEvent } from 'react';
import styled from 'styled-components';

import { makeClassName } from '@utils/utils';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  text: string;
  event?: (
    e: MouseEvent<HTMLButtonElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...arg: any[]
  ) => void | Promise<void>;
  className?: string[];
  theme: string;
  id?: string;
  style?: { [key: string]: string };
}

export default function Button({
  text,
  event,
  className,
  theme,
  style,
  id,
  ...rest
}: ButtonProps): JSX.Element {
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (event) await event(e, { ...rest });
  };

  return (
    <ButtonSt
      className={
        Array.isArray(className) ? makeClassName([...className, theme]) : theme
      }
      onClick={handleClick}
      style={style}
      id={id}
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
  padding: 0 18px;
  border-radius: 15px;
  transition: var(--transition);
  font-size: 14px;

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
