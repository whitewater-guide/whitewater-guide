import { configureApolloClient } from '../../commons/apollo';

export const apolloClient = configureApolloClient({
  reduxRootSelector: state => state.transient.apollo,
});

