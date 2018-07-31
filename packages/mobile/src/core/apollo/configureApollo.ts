import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
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

    apolloClient = new ApolloClient({
      link: httpLink,
      cache: inMemoryCache,
      connectToDevTools: process.env.NODE_ENV === 'development',
    });
  }

  return apolloClient;
};
