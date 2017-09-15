import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import * as casual from 'casual';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import typeDefs from './typedefs';
import { graphql } from 'graphql';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });

const mockNetworkInterface = mockNetworkInterfaceWithSchema({
  schema,
  mocks: {
    ID: () => casual.uuid(),
  },
});

const client = new ApolloClient({
  networkInterface: mockNetworkInterface,
});

export const MockingProvider: React.StatelessComponent = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

const query = `
  query listRegions {
    region(id:  "7fbe024f-3316-4265-a6e8-c65a837e308a"){
      id
      name
    }
  }
`;
graphql(schema, query).then((result) => console.log('Got result', JSON.stringify(result)));
// {"regions":[{"id":"21163357-a580-4102-a5a2-28730fe12f81","name":"Hello World"},{"id":"be997903-8c39-48b8-8a99-4ffda483c0e1","name":"Hello World"}]}}
//:{"regions":[{"id":"22a66c6b-0008-4d13-84a8-200fbd005960","name":"Hello World"},{"id":"22fc7631-1c2e-4327-9a24-8d93e9cae048","name":"Hello World"}]}}
