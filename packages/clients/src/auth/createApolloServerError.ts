import { ServerError } from '@apollo/client';

import { AuthResponse } from './types';

export function createApolloServerError(resp: AuthResponse): ServerError {
  const errorString = resp.error
    ? Object.entries(resp.error)[0].join('.')
    : 'form.unknown_error';
  const error = new Error(errorString) as ServerError;

  error.name = 'ServerError';
  error.statusCode = resp.status;
  error.result = resp;
  return error;
}
