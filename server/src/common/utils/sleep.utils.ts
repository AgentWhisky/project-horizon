/**
 * Sleep operation for a given amount of miliseconds
 * @param ms The given miliseconds to sleep
 */
export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
