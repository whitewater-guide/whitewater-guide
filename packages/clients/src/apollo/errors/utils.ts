import { ServerError } from 'apollo-link-http-common';

export const isApolloServerError = (err: any): err is ServerError =>
  !!err && err.name === 'ServerError';
