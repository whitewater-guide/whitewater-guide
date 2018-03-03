import { Dispatch } from 'react-redux';
import { configureApolloClient } from '../ww-clients/apollo';

export const getApolloClient = (dispatch: Dispatch<any>) => configureApolloClient({
  dispatch,
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  credentials: process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
});
