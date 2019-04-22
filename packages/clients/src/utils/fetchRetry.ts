import retry from 'async-retry';

export const fetchRetry = (
  url: RequestInfo,
  opts?: RequestInit,
  retryOpts?: retry.Options,
) => {
  const rOpts: retry.Options = {
    retries: 3,
    randomize: true,
    minTimeout: 300,
    ...retryOpts,
  };
  return retry(async () => {
    const res = await fetch(url, opts);
    if (res.status >= 500) {
      throw new Error(`fetch returned ${res.status}`);
    }
    return res;
  }, rOpts);
};
