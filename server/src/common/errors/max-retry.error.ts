export class RetryExhaustedError extends Error {
  constructor(message = 'Maximum retries exceeded') {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}
