import { configureApolloClient } from '../ww-clients/apollo';

export const apolloClient = configureApolloClient({
  reduxRootSelector: state => state.transient.apollo,
});
