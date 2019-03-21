import { ApolloCache } from 'apollo-cache';
import { ApolloError } from 'apollo-client';
import { LocalResolver } from '../types';
import { APOLLO_ERROR_QUERY } from './apolloError.query';

type ErrorType = Pick<ApolloError, 'networkError' | 'graphQLErrors'> | null;

interface Vars {
  error: ErrorType;
}

export const setApolloErrorClientResolver: LocalResolver<Vars> = (
  _,
  { error },
  { cache },
) => {
  cache.writeQuery({ query: APOLLO_ERROR_QUERY, data: { apolloError: error } });
  return null;
};

export const writeInitialApolloError = (cache: ApolloCache<any>) => {
  cache.writeData({ data: { apolloError: null } });
};
