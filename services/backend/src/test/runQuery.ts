import { createTestClient } from 'apollo-server-testing';
import { ExecutionResult } from 'graphql';
import { createTestServer } from '../apollo/server';
import { anonContext } from './context';

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
