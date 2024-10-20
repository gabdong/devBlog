/**
 * * className 만들어주는 함수
 * @param arr - className으로 만들 배열
 * @returns - className
 */
export function makeClassName(arr: string[]): string {
  return arr.filter((str) => str != '').join(' ');
}
