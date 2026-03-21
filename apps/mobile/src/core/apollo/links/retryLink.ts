import { RetryLink } from '@apollo/client/link/retry';

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) =>
      // retries fetch errors (no status code) and 500 errors
      // 400 = refresh failed
      // 401 = unauthenticated or jwt expired
      !!error && error.statusCode !== 401 && error.statusCode !== 400,
  },
});
