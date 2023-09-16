import { ApolloError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import type { AuthBody } from '@whitewater-guide/commons';
import get from 'lodash/get';

import { isApolloServerError } from './utils';

export const JWT_EXPIRED_CTX_KEY = 'jwtExpired';

export const errorLink = (
  handleAuthError?: () => void,
  handleApolloError?: (e: ApolloError, isMutation: boolean) => void,
) =>
  onError(({ networkError, graphQLErrors, operation, forward }) => {
    if (isApolloServerError(networkError) && networkError.statusCode === 401) {
      const body: AuthBody = networkError.result as any;
      if (body.error && body.error.indexOf('expired') >= 0) {
        // Set context flag and forward, so token can be refetched further in link chain
        // https://www.apollographql.com/docs/link/links/error.html#retry-request
        operation.setContext({
          [JWT_EXPIRED_CTX_KEY]: true,
        });
        return forward(operation);
      } else {
        // Most likey, log out
        handleAuthError?.();
      }
    } else if (
      graphQLErrors?.some(
        (ge) => get(ge, 'extensions.code') === 'UNAUTHENTICATED',
      )
    ) {
      operation.setContext({
        [JWT_EXPIRED_CTX_KEY]: true,
      });
      // Retry forward
      // https://www.apollographql.com/docs/link/links/error.html#retry-request
      return forward(operation);
    }
    const err = new ApolloError({ graphQLErrors, networkError });
    const isMutation = operation.query.definitions.some(
      (d) => d.kind === 'OperationDefinition' && d.operation === 'mutation',
    );
    handleApolloError?.(err, isMutation);
  });
