import { ErrorResponse } from 'apollo-link-error';
import { Action } from 'typescript-fsa';
import { APOLLO_ERROR } from './actions';

export interface ApolloErrorState {
  short?: string;
  full?: string;
}

const initialState: ApolloErrorState = {};

export const apolloErrorReducer = (
  state = initialState,
  action: Action<ErrorResponse>,
) => {
  if (action.type === APOLLO_ERROR) {
    const { payload } = action;
    if (!payload.graphQLErrors && !payload.networkError) {
      return {};
    }
    const msg = payload.networkError
      ? payload.networkError.message
      : payload.graphQLErrors![0].message;
    return {
      short: `${payload.operation.operationName}: ${msg}`,
      full: JSON.stringify(payload, null, 2),
    };
  }
  return state;
};
