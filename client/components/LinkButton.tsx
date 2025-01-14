import styled from 'styled-components';
import Link from 'next/link';

import { buildClassName } from '@utils/utils';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  text: string;
  href: string;
  className?: string[];
  theme?: string;
  id?: string;
  icon?: JSX.Element;
  style?: { [key: string]: string };
}

export default function LinkButton({
  text,
  href,
  className,
  theme = 'background',
  style,
  id,
  icon,
}: ButtonProps): JSX.Element {
  return (
    <ButtonSt
      className={
        Array.isArray(className) ? buildClassName([...className, theme]) : theme
      }
      href={href}
      style={style}
      id={id}
    >
      <span>{text}</span>
      {icon && <div>{icon}</div>}
    </ButtonSt>
  );
}

const ButtonSt = styled(Link)`
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

    &:hover,
    &.active {
      background: var(--primary-color);
    }
    & span {
      color: #ffffff;
    }
  }

  &.border {
    border: 1px solid var(--gray);
    background: none;

    &:hover,
    &.active {
      border: 1px solid var(--primary-color);
    }
  }

  &.none {
    padding: 0;

    &:hover,
    &.active {
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
`;
