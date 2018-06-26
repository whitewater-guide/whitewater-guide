import { onError } from 'apollo-link-error';
import { Dispatch } from 'redux';
import { apolloErrorSet } from './actions';

export const createApolloErrorLink = (dispatch?: Dispatch) => onError((response) => {
  const { graphQLErrors, networkError } = response;
  if (dispatch && (networkError || graphQLErrors && graphQLErrors.length)) {
    dispatch(apolloErrorSet(response));
  }
});
