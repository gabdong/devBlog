import { ChangeEvent, useState } from 'react';

export default function useInput(initialValue: string | number) {
  const [value, setValue] = useState(initialValue);
  const handler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, handler, setValue] as const;
}
