import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import Config from 'react-native-config';
import RNLanguages from 'react-native-languages';
import { assertCachePersistorVersion, inMemoryCache } from './cache';

let apolloClient: ApolloClient<any>;

export const getApolloClient = async () => {
  if (!apolloClient) {
    const httpLink = createHttpLink({
      uri: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/graphql`,
      credentials: 'include',
      headers: {
        'Accept-Language': RNLanguages.language,
        'Cache-Control': 'no-store',
      },
    });

    await assertCachePersistorVersion();

    const link = ApolloLink.from([
      // offlineLink,
      new RetryLink(),
      httpLink,
    ]);

    apolloClient = new ApolloClient({
      link,
      cache: inMemoryCache,
      connectToDevTools: __DEV__,
      defaultOptions: {
        mutate: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });
  }

  return apolloClient;
};
