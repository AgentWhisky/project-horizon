/**
 * Sleep operation for a given amount of miliseconds
 * @param ms The given miliseconds to sleep
 * @param abortSignal The AbortSignal used to abort the sleep timeout
 */
export function sleep(ms: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    function cleanup() {
      if (abortSignal) {
        abortSignal.removeEventListener('abort', onAbort);
      }
      clearTimeout(timer);
    }

    function onAbort() {
      cleanup();
      reject(new SleepAbortedError());
    }

    if (abortSignal) {
      // Check for aported signal on start
      if (abortSignal.aborted) {
        cleanup();
        return reject(new SleepAbortedError());
      }
      abortSignal.addEventListener('abort', onAbort);
    }
  });
}

export class SleepAbortedError extends Error {
  constructor() {
    super('Sleep aborted');
    this.name = 'SleepAbortedError';
  }
}
