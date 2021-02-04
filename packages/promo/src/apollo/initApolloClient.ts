import {
  appErrorResolver,
  AuthService,
  configureApolloCache,
  errorLink,
} from '@whitewater-guide/clients';
import { RefreshJwtLink } from '@whitewater-guide/clients/dist/web';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';

import { API_HOST } from '../environment';
import { initLocalState } from './initLocalState';

export const initApolloClient = (auth: AuthService) => {
  const httpLink = createHttpLink({
    credentials: 'include',
    uri: `${API_HOST}/graphql`,
  });

  const cache = configureApolloCache();
  initLocalState(cache);

  const refreshJwtLink = new RefreshJwtLink(auth);

  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink(cache, (err) => {
        if (err.type === 'auth') {
          // history.replace('/regions');
        }
      }),
      refreshJwtLink,
      httpLink,
    ]),
    cache,
    connectToDevTools: process.env.NODE_ENV === 'development',
    resolvers: {
      Mutation: {
        ...appErrorResolver,
      },
    },
  });
  client.onClearStore(() => {
    initLocalState(cache);
    return Promise.resolve();
  });
  client.onResetStore(() => {
    initLocalState(cache);
    return Promise.resolve();
  });

  return client;
};