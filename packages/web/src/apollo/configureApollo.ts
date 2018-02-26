import { configureApolloClient } from '../ww-clients/apollo';

export const apolloClient = configureApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  credentials: process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
});
