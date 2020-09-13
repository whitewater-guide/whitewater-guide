import { ServerError } from 'apollo-link-http-common';

import { AuthResponse } from './types';

export const createApolloServerError = (resp: AuthResponse) => {
  const errorString = resp.error
    ? Object.entries(resp.error)[0].join('.')
    : 'form.unknown_error';
  const error = new Error(errorString) as ServerError;

  error.name = 'ServerError';
  error.statusCode = resp.status;
  error.result = resp;
  return error;
};
