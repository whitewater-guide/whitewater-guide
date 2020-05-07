import { GraphQLError } from 'graphql';
import { anonContext } from './context';
import { createTestClient } from 'apollo-server-testing';
import { createTestServer } from '../apollo/server';

interface ExecutionResult<T> {
  errors?: ReadonlyArray<GraphQLError>;
  data?: T | null;
}

export const runQuery = async <T = any>(
  query: string,
  variables?: any,
  context?: any,
): Promise<ExecutionResult<T>> => {
  const server = await createTestServer(context || anonContext());
  const client = createTestClient(server);
  if (query.indexOf('mutation') >= 0) {
    return client.mutate({ mutation: query, variables } as any) as any;
  } else {
    return client.query({ query, variables } as any) as any;
  }
};
