import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { APOLLO_ERROR_MUTATION } from '../apolloError.mutation';
import { APOLLO_ERROR_QUERY } from '../apolloError.query';
import {
  setApolloErrorClientResolver,
  writeInitialApolloError,
} from '../setApolloErrorClientResolver';

let client: ApolloClient<any>;

beforeEach(() => {
  const cache = new InMemoryCache();
  writeInitialApolloError(cache);
  client = new ApolloClient({
    resolvers: {
      Mutation: {
        setApolloError: setApolloErrorClientResolver,
      },
    },
    cache,
  });
});

it('should read initial state', async () => {
  const { errors, data } = await client.query({ query: APOLLO_ERROR_QUERY });
  expect(errors).toBeUndefined();
  expect(data.apolloError).toBe(null);
});

it('should set some value and then read it initial state', async () => {
  const { errors: mutateErrors } = await client.mutate({
    mutation: APOLLO_ERROR_MUTATION,
    variables: {
      error: {
        networkError: new Error('networkError'),
        graphQLErrors: [
          new Error('graphQLErrors1'),
          new Error('graphQLErrors2'),
        ],
      },
    },
  });
  expect(mutateErrors).toBeUndefined();
  const { errors, data } = await client.query({ query: APOLLO_ERROR_QUERY });
  expect(errors).toBeUndefined();
  expect(data.apolloError).toEqual({
    networkError: expect.any(Error),
    graphQLErrors: [expect.any(Error), expect.any(Error)],
  });
});

it('should set null', async () => {
  await client.mutate({
    mutation: APOLLO_ERROR_MUTATION,
    variables: {
      error: {
        networkError: new Error('networkError'),
        graphQLErrors: [
          new Error('graphQLErrors1'),
          new Error('graphQLErrors2'),
        ],
      },
    },
  });
  await client.mutate({
    mutation: APOLLO_ERROR_MUTATION,
    variables: {
      error: null,
    },
  });
  const { errors, data } = await client.query({ query: APOLLO_ERROR_QUERY });
  expect(errors).toBeUndefined();
  expect(data.apolloError).toBeNull();
});
