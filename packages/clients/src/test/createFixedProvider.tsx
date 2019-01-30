import { ApolloClient } from 'apollo-client';
import { DocumentNode } from 'graphql';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { configureApolloCache } from '../apollo';
import { mockSingleLink } from './test-links';

export interface FixedProviderOptions<TResult = any, TVars = any> {
  responses: Array<{
    request?: {
      query: DocumentNode;
      variables?: TVars;
    };
    result?: { data: TResult };
    error?: any;
  }>;
  addTypename?: boolean;
  cache?: {
    query: DocumentNode;
    data: TResult;
    variables?: TVars;
  };
}

export type FixedProviderStatic = React.SFC & {
  client: ApolloClient<any>;
};

export function createFixedProvider<TResult = any, TVars = any>(
  options: FixedProviderOptions<TResult, TVars>,
) {
  const { responses = [], addTypename = true, cache } = options;
  const link = mockSingleLink(...responses, addTypename);
  const client = new ApolloClient({
    link,
    cache: configureApolloCache(),
  });

  const FixedProvider: React.SFC = ({ children }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  if (cache) {
    client.writeQuery(cache);
  }

  // tslint:disable-next-line:prefer-object-spread
  const result: FixedProviderStatic = Object.assign(FixedProvider, { client });
  return result;
}
