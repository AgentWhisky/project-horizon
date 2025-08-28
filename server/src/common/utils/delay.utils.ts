/**
 * Delay operation for a given amount of miliseconds
 * @param ms The given miliseconds to delay
 */
export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
