import { configureApolloClient } from '../ww-clients/apollo';

console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);

export const apolloClient = configureApolloClient({
  reduxRootSelector: (state: any) => state.transient.apollo,
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});
