import type { ApolloServer } from '@apollo/server';
import type { DocumentNode, FormattedExecutionResult } from 'graphql';
import { print } from 'graphql';

import type { Context } from '../apollo/index';

type StringOrAst = string | DocumentNode;

// A query must not come with a mutation (and vice versa).
interface Query<TVariables = Record<string, any>> {
  query: StringOrAst;
  mutation?: undefined;
  variables?: TVariables;
  operationName?: string;
}
interface Mutation<TVariables = Record<string, any>> {
  mutation: StringOrAst;
  query?: undefined;
  variables?: TVariables;
  operationName?: string;
}

export interface ApolloServerTestClient {
  query: <TData = any, TVariables = Record<string, any>>(
    query: Query<TVariables>,
    context: Context,
  ) => Promise<FormattedExecutionResult<TData>>;
  mutate: <TData = any, TVariables = Record<string, any>>(
    mutation: Mutation<TVariables>,
    context: Context,
  ) => Promise<FormattedExecutionResult<TData>>;
}

export function createTestClient(
  server: ApolloServer<Context>,
): ApolloServerTestClient {
  const executeOperation = server.executeOperation.bind(server);

  const test = async (
    { query, mutation, ...args }: Query | Mutation,
    context: Context,
  ) => {
    const operation = query || mutation;

    if (!operation || (query && mutation)) {
      throw new Error(
        'Either `query` or `mutation` must be passed, but not both.',
      );
    }

    const response = await executeOperation(
      {
        // Convert ASTs, which are produced by `graphql-tag` but not currently
        // used by `executeOperation`, to a String using `graphql/language/print`.
        query: typeof operation === 'string' ? operation : print(operation),
        ...args,
      },
      {
        contextValue: context,
      },
    );
    if (response.body.kind !== 'single') {
      throw new Error('only single req');
    }
    return response.body.singleResult;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { query: test, mutate: test } as ApolloServerTestClient;
}
