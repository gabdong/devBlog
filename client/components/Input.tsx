import { forwardRef } from 'react';
import styled from 'styled-components';

/**
 * * Input
 * @param {String} border all, top, bottom, left, right
 * @param {String} accept 파일일경우 확장자
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      placeholder,
      defaultValue,
      style,
      onChange,
      onKeyUp,
      onFocus,
      border = 'all',
      id,
      accept,
    },
    ref,
  ) => {
    return (
      <InputSt
        type={type}
        name={name}
        className="inputText"
        placeholder={placeholder}
        style={style}
        value={defaultValue || ''}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        autoComplete="off"
        ref={ref}
        $border={border}
        id={id}
        accept={accept}
      />
    );
  },
);

const InputSt = styled.input<{
  $border?: 'all' | 'left' | 'right' | 'top' | 'bottom';
}>`
  ${(props) =>
    props.$border == 'all'
      ? 'border: 1px solid #ddd; padding: 8px 12px;'
      : `border-${props.$border}: 1px solid #ddd; padding: 8px 4px;`}
  ${(props) =>
    props.$border == 'all' ? 'border-radius: var(--border-radius);' : ''}
  cursor: pointer;
  transition: var(--transition);

  &:active,
  &:focus,
  &:hover {
    ${(props) =>
      props.$border == 'all'
        ? 'border: 1px solid var(--primary-color);'
        : `border-${props.$border} : 1px solid var(--primary-color);`}
  }
`;

Input.displayName = 'Input';
export default Input;
