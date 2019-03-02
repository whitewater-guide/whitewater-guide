import { configureApolloClient } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import { API_HOST } from '../environment';

let apolloClient: ApolloClient<any>;

export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = configureApolloClient({
      dispatch: undefined,
      uri: `${API_HOST}/graphql`,
      credentials: 'include',
    } as any);
  }
  return apolloClient;
};
