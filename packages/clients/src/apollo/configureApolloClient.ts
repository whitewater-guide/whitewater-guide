import { ApolloClient } from 'apollo-client';
import { createHttpLink, FetchOptions } from 'apollo-link-http';
import { configureApolloCache } from './configureApolloCache';

type Options = FetchOptions;

export function configureApolloClient(options: Options) {
  const link = createHttpLink(options);

  return new ApolloClient({
    link,
    cache: configureApolloCache(),
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
}
