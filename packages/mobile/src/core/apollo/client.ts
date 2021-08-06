import { appErrorResolver, AuthService } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';

import { assertCachePersistorVersion, inMemoryCache } from './cache';
import { createLink } from './createLink';
import { initLocalState } from './initLocalState';

// Ugly solution, will have to change this when upgrading apollo client to v3
// eslint-disable-next-line import/no-mutable-exports
export let apolloClient: ApolloClient<any>;

export const initApolloClient = async (auth: AuthService) => {
  if (!apolloClient) {
    await assertCachePersistorVersion();

    apolloClient = new ApolloClient({
      link: createLink(auth),
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
      resolvers: {
        Mutation: {
          ...appErrorResolver,
        },
      },
      assumeImmutableResults: true,
    });

    initLocalState(apolloClient.cache);

    apolloClient.onClearStore(() => {
      initLocalState(inMemoryCache);
      return Promise.resolve();
    });
    apolloClient.onResetStore(() => {
      initLocalState(inMemoryCache);
      return Promise.resolve();
    });
  }

  return apolloClient;
};
