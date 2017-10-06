import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import * as casual from 'casual';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import typeDefs from './typedefs';

interface QueryMap {
  [name: string]: (variables: any) => any;
}

export const createMockedProvider = (queries: QueryMap = {}, mutations: QueryMap = {}) => {

  const schema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({
    schema,
    mocks: {
      ID: () => casual.uuid,
      Int: () => casual.integer(),
      Float: () => casual.random,
      String: () => casual.title,
      Boolean: () => casual.coin_flip,
      Query: () => queries,
      Mutation: () => mutations,
    },
  });

  const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

  const client = new ApolloClient({
    networkInterface: mockNetworkInterface,
  });

  const MockedProvider: React.StatelessComponent & { client?: ApolloClient } = ({ children }) => (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );

  MockedProvider.client = client;

  return MockedProvider;
};
