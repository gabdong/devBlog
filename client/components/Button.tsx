import { MouseEvent } from 'react';
import styled from 'styled-components';

import { makeClassName } from '@utils/utils';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  text?: string;
  event?: (
    e: MouseEvent<HTMLButtonElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...arg: any[]
  ) => void | Promise<void>;
  className?: string[];
  theme?: 'background' | 'border' | 'none';
  id?: string;
  icon?: JSX.Element;
  style?: { [key: string]: string };
}

export default function Button({
  text,
  event,
  className,
  theme = 'background',
  style,
  id,
  icon,
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
      {text && <span>{text}</span>}
      {icon && <div>{icon}</div>}
      {rest.children && rest.children}
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

  &.none {
    padding: 0;
    &:hover {
      color: var(--primary-color);
    }
  }

  & > div {
    margin-top: 2px;
    margin-left: 8px;
  }

  & > span {
    font-size: 14px;
  }

  @media all and (max-width: ${process.env.NEXT_PUBLIC_MOBILE_WIDTH}) {
    height: 24px;
    padding: 0 14px;

    &:hover {
      color: inherit !important;
    }
  }
`;
