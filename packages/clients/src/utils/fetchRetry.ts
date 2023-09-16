import retry from 'async-retry';

interface RetryOptions {
  retries?: number;
  randomize?: boolean;
  minTimeout?: number;
}

export const fetchRetry = (
  url: RequestInfo,
  opts?: RequestInit,
  retryOpts?: RetryOptions,
) => {
  const rOpts: RetryOptions = {
    retries: 3,
    randomize: true,
    minTimeout: 300,
    ...retryOpts,
  };
  return retry(async () => fetch(url, opts), rOpts as any);
};
