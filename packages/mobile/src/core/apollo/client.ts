import { appErrorResolver } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import { MobileAuthService } from '../auth';
import { assertCachePersistorVersion, inMemoryCache } from './cache';
import { createLink } from './createLink';
import { initLocalState } from './initLocalState';

export let apolloClient: ApolloClient<any>;

export const initApolloClient = async (auth: MobileAuthService) => {
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
