import { ChangeEvent, useState } from 'react';

export default function useInput<T = string>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const handler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as unknown as T);
  };

  return [value, handler, setValue] as const;
}
