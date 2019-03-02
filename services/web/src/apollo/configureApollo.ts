import { configureApolloClient } from '@whitewater-guide/clients';
import { ApolloLink } from 'apollo-link';
import { Dispatch } from 'redux';
import { API_HOST } from '../environment';

export const getApolloClient = (dispatch: Dispatch, links?: ApolloLink[]) =>
  configureApolloClient({
    dispatch,
    links,
    uri: `${API_HOST}/graphql`,
    credentials: 'include',
  });
