import Config from 'react-native-config';
import { Dispatch } from 'react-redux';
import { configureApolloClient } from '../../ww-clients/apollo';

export const getApolloClient = (dispatch: Dispatch<any>) => configureApolloClient({
  dispatch,
  uri: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/graphql`,
  credentials: 'include',
});
