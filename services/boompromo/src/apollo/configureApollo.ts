import { configureApolloCache } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { API_HOST } from '../environment';

let apolloClient: ApolloClient<any>;

export const getApolloClient = () => {
  if (!apolloClient) {
    const httpLink = createHttpLink({
      credentials: 'include',
      uri: `${API_HOST}/graphql`,
    });
    const cache = configureApolloCache();

    apolloClient = new ApolloClient({
      link: httpLink,
      cache,
      connectToDevTools: process.env.NODE_ENV === 'development',
    });
  }
  return apolloClient;
};
