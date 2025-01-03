import { useRef } from 'react';

/**
 * - component 첫 랜더링인지 판별
 */
export default function useFirstRender() {
  const ref = useRef(true);
  const firstRender = ref.current;
  ref.current = false;

  return firstRender;
}
