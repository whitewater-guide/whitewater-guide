import { ApolloClient } from '@apollo/client';
import { ApolloLink } from '@apollo/client/link/core';
import { createHttpLink } from '@apollo/client/link/http';
import {
  AuthService,
  configureApolloCache,
  errorLink,
} from '@whitewater-guide/clients';
import { RefreshJwtLink } from '@whitewater-guide/clients/dist/web';

import { API_HOST } from '../environment';

export const initApolloClient = (auth: AuthService) => {
  const httpLink = createHttpLink({
    credentials: 'include',
    uri: `${API_HOST}/graphql`,
  });

  const cache = configureApolloCache();

  const refreshJwtLink = new RefreshJwtLink(auth);

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink(), refreshJwtLink, httpLink]),
    cache,
    connectToDevTools: process.env.NODE_ENV === 'development',
  });

  return client;
};
