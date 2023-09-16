import type { ServerError } from '@apollo/client';

export function isServerError(e?: Error | null): e is ServerError {
  return e?.name === 'ServerError';
}
