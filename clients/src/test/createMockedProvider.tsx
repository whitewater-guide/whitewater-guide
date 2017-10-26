import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import * as casual from 'casual';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import * as GraphQLJSON from 'graphql-type-json';
import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { HarvestMode } from '../../ww-commons';
import typeDefs from './typedefs';

export interface QueryMap {
  [name: string]: (variables: any) => any;
}

export const createMockedProvider = (queries: QueryMap = {}, mutations: QueryMap = {}) => {

  const schema = makeExecutableSchema({ typeDefs, resolvers: { JSON: GraphQLJSON } });
  addMockFunctionsToSchema({
    schema,
    mocks: {
      ID: () => casual.uuid,
      Int: () => casual.integer(),
      Float: () => casual.random,
      String: () => casual.title,
      Boolean: () => casual.coin_flip,
      HarvestMode: () => [HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE][casual.integer(0, 1)],
      JSON: () => ({ [casual.word]: casual.word }),
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
