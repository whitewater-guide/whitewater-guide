import { ApolloClient, ApolloProvider } from '@apollo/client';
import { MockedResponse, mockSingleLink } from '@apollo/client/testing';
import { DocumentNode } from 'graphql';
import React, { PropsWithChildren } from 'react';

import { configureApolloCache } from '../apollo';

export interface FixedProviderOptions<TResult = any, TVars = any> {
  responses: MockedResponse[];
  addTypename?: boolean;
  cache?: {
    query: DocumentNode;
    data: TResult;
    variables?: TVars;
  };
}

export type FixedProviderStatic = React.FC & {
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

  const FixedProvider = ({ children }: PropsWithChildren) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  if (cache) {
    client.writeQuery(cache);
  }

  const result: FixedProviderStatic = Object.assign(FixedProvider, { client });
  return result;
}
