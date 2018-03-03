import { ErrorResponse } from 'apollo-link-error';

export const APOLLO_ERROR = 'APOLLO_ERROR';

export const apolloErrorSet = (payload: ErrorResponse) => ({
  type: APOLLO_ERROR,
  payload,
});

export const apolloErrorClear = () => ({
  type: APOLLO_ERROR,
  payload: {},
});
