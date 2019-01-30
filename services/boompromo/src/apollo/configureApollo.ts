import { configureApolloClient } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';

let apolloClient: ApolloClient<any>;

export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = configureApolloClient({
      dispatch: undefined,
      uri: `${process.env.REACT_APP_API_HOST}/graphql`,
      credentials:
        process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
    } as any);
  }
  return apolloClient;
};
