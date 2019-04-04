import { AuthPayload } from '@whitewater-guide/commons';
import { ApolloCache } from 'apollo-cache';
import { onError } from 'apollo-link-error';
import { ServerError } from 'apollo-link-http-common';
import get from 'lodash/get';
import { APOLLO_ERROR_QUERY } from './apolloError.query';

export const isApolloServerError = (err: any): err is ServerError =>
  !!err && err.name === 'ServerError';

export const JWT_EXPIRED_CTX_KEY = 'jwtExpired';

export const errorLink = (
  cache: ApolloCache<any>,
  onUnauthenticated?: (payload?: AuthPayload) => void,
) =>
  onError((response) => {
    const { networkError, graphQLErrors, operation, forward } = response;
    if (isApolloServerError(networkError) && networkError.statusCode === 401) {
      const body: AuthPayload = networkError.result as any;
      if (body.error === 'jwt.expired') {
        // Set context flag and forward, so token can be refetched further in link chain
        // https://www.apollographql.com/docs/link/links/error.html#retry-request
        operation.setContext({
          [JWT_EXPIRED_CTX_KEY]: true,
        });
        return forward(operation);
      } else {
        cache.writeQuery({
          query: APOLLO_ERROR_QUERY,
          data: { apolloError: { networkError, graphQLErrors } },
        });
        // Access token screwed, redirect to home/login screen
        if (onUnauthenticated) {
          onUnauthenticated(body);
        }
      }
    } else if (
      graphQLErrors &&
      graphQLErrors.some(
        (ge) => get(ge, 'extensions.code') === 'UNAUTHENTICATED',
      )
    ) {
      operation.setContext({
        [JWT_EXPIRED_CTX_KEY]: true,
      });
      // Retry forward
      // https://www.apollographql.com/docs/link/links/error.html#retry-request
      return forward(operation);
    } else if (networkError || (graphQLErrors && graphQLErrors.length)) {
      cache.writeQuery({
        query: APOLLO_ERROR_QUERY,
        data: { apolloError: { networkError, graphQLErrors } },
      });
    }
  });
