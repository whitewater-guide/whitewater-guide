import { AuthBody } from '@whitewater-guide/commons';
import { ApolloCache } from 'apollo-cache';
import { onError } from 'apollo-link-error';
import get from 'lodash/get';

import { AppError, AppErrorType } from './AppError';
import { APP_ERROR_QUERY, AppErrorQueryResult } from './appError.query';
import { isApolloServerError } from './utils';

export const JWT_EXPIRED_CTX_KEY = 'jwtExpired';

export const errorLink = (
  cache: ApolloCache<any>,
  handleError?: (error: AppError) => void | Promise<void>,
) =>
  onError(
    async (response): Promise<any> => {
      let appErrorMessage: AppErrorType | undefined;
      const { networkError, graphQLErrors, operation, forward } = response;
      if (
        isApolloServerError(networkError) &&
        networkError.statusCode === 401
      ) {
        const body: AuthBody = networkError.result as any;
        if (body.error && body.error.indexOf('expired') >= 0) {
          // Set context flag and forward, so token can be refetched further in link chain
          // https://www.apollographql.com/docs/link/links/error.html#retry-request
          operation.setContext({
            [JWT_EXPIRED_CTX_KEY]: true,
          });
          return forward(operation);
        } else {
          appErrorMessage = 'auth';
        }
      } else if (
        networkError &&
        (networkError as any).statusCode === undefined
      ) {
        appErrorMessage = 'fetch';
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
      }
      const appError = new AppError(
        { networkError, graphQLErrors },
        appErrorMessage,
      );
      cache.writeQuery<AppErrorQueryResult>({
        query: APP_ERROR_QUERY,
        data: { appError },
      });
      if (handleError) {
        await Promise.resolve<void>(handleError(appError));
      }
    },
  );
