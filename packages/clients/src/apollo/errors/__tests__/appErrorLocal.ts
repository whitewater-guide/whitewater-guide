import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';

import { AppError } from '../AppError';
import { APP_ERROR_MUTATION, AppErrorMutationVars } from '../appError.mutation';
import { APP_ERROR_QUERY, AppErrorQueryResult } from '../appError.query';
import { appErrorResolver, writeInitialAppError } from '../appErrorResolver';

let client: ApolloClient<any>;

beforeEach(() => {
  const cache = new InMemoryCache();
  writeInitialAppError(cache);
  client = new ApolloClient({
    resolvers: {
      Mutation: {
        ...appErrorResolver,
      },
    },
    cache,
  });
});

it('should read initial state', async () => {
  const { errors, data } = await client.query<AppErrorQueryResult>({
    query: APP_ERROR_QUERY,
  });
  expect(errors).toBeUndefined();
  expect(data.appError).toBe(null);
});

it('should set some value and then read it initial state', async () => {
  const { errors: mutateErrors } = await client.mutate<
    unknown,
    AppErrorMutationVars
  >({
    mutation: APP_ERROR_MUTATION,
    variables: {
      error: new AppError({
        networkError: new Error('networkError'),
        graphQLErrors: [
          new Error('graphQLErrors1'),
          new Error('graphQLErrors2'),
        ],
      }),
    },
  });
  expect(mutateErrors).toBeUndefined();
  const { errors, data } = await client.query<AppErrorQueryResult>({
    query: APP_ERROR_QUERY,
  });
  expect(errors).toBeUndefined();
  expect(data.appError!.original).toEqual({
    networkError: expect.any(Error),
    graphQLErrors: [expect.any(Error), expect.any(Error)],
  });
});

it('should set null', async () => {
  await client.mutate<unknown, AppErrorMutationVars>({
    mutation: APP_ERROR_MUTATION,
    variables: {
      error: new AppError({
        networkError: new Error('networkError'),
        graphQLErrors: [
          new Error('graphQLErrors1'),
          new Error('graphQLErrors2'),
        ],
      }),
    },
  });
  await client.mutate<unknown, AppErrorMutationVars>({
    mutation: APP_ERROR_MUTATION,
    variables: {
      error: null,
    },
  });
  const { errors, data } = await client.query<AppErrorQueryResult>({
    query: APP_ERROR_QUERY,
  });
  expect(errors).toBeUndefined();
  expect(data.appError).toBeNull();
});
