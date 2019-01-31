import { configureApolloClient } from '@whitewater-guide/clients';
import { ApolloLink } from 'apollo-link';
import { Dispatch } from 'redux';

const endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'graphql';
const host = process.env.REACT_APP_API_HOST || '';

export const getApolloClient = (dispatch: Dispatch, links?: ApolloLink[]) =>
  configureApolloClient({
    dispatch,
    links,
    uri: `${host}/${endpoint}`,
    credentials:
      process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
  });