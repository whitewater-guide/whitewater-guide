import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import * as casual from 'casual';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import typeDefs from './typedefs';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({
  schema,
  mocks: {
    ID: () => casual.uuid,
    Int: () => casual.integer(),
    Float: () => casual.random,
    String: () => casual.title,
    Boolean: () => casual.coin_flip,
  },
});

const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
  networkInterface: mockNetworkInterface,
});

export const MockingProvider: React.StatelessComponent = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

// import { graphql } from 'graphql';
// const query = `
//   query listRegions {
//     region(id:  "7fbe024f-3316-4265-a6e8-c65a837e308a"){
//       id
//       name
//     }
//   }
// `;
// graphql(schema, query).then((result) => console.log('Got result', JSON.stringify(result)));
