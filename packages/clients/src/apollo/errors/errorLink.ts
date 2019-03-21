import { ApolloCache } from 'apollo-cache';
import { onError } from 'apollo-link-error';
import { ServerError } from 'apollo-link-http-common';
import { APOLLO_ERROR_QUERY } from './apolloError.query';

export const isApolloServerError = (err: any): err is ServerError =>
  !!err && err.name === 'ServerError';

interface Body401 {
  success: false;
  error: string;
}

export const JWT_EXPIRED_CTX_KEY = 'jwtExpired';

export const errorLink = (
  cache: ApolloCache<any>,
  onUnauthenticated: () => void,
) =>
  onError((response) => {
    const { networkError, graphQLErrors, operation, forward } = response;
    if (isApolloServerError(networkError) && networkError.statusCode === 401) {
      const { error }: Body401 = networkError.result as any;
      if (error === 'jwt.expired') {
        operation.setContext({
          [JWT_EXPIRED_CTX_KEY]: true,
        });
        // Retry forward
        // https://www.apollographql.com/docs/link/links/error.html#retry-request
        return forward(operation);
      } else {
        // Access token screwed, redirect to home/login screen
        onUnauthenticated();
        cache.writeQuery({
          query: APOLLO_ERROR_QUERY,
          data: { apolloError: { networkError, graphQLErrors } },
        });
      }
    } else if (networkError || (graphQLErrors && graphQLErrors.length)) {
      cache.writeQuery({
        query: APOLLO_ERROR_QUERY,
        data: { apolloError: { networkError, graphQLErrors } },
      });
    }
  });
