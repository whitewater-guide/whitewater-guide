import type { ServerError } from '@apollo/client/link/utils';

export const isApolloServerError = (err: any): err is ServerError =>
  !!err && err.name === 'ServerError';
