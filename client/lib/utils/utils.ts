/**
 * * className 만들어주는 함수
 * @param arr - className으로 만들 배열
 * @returns - className
 */
export function makeClassName(arr: string[]): string {
  return arr.filter((str) => str != '').join(' ');
}

/**
 * * cookie string에서 원하는 key의 value를 return해주는 함수
 * @param  targetKey
 * @param queryString
 * @returns - target key's value
 */
export function getCookieValue(
  targetKey: string,
  queryString?: string,
): string | number | null {
  if (!queryString) return null;

  const cookies = queryString.split('; ');

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === targetKey) return value;
  }

  return null;
}
