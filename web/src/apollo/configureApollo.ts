import { configureApolloClient } from '../ww-clients/apollo';

console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);

export const apolloClient = configureApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  reduxRootSelector: (state: any) => state.transient.apollo,
  opts: {
    credentials: process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
  },
});
