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
      !!error && error.statusCode !== 401 && error.statusCode !== 400,
  },
});
