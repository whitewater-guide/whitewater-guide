import ApolloClient from 'apollo-client';
import Config from 'react-native-config';
import RNLanguages from 'react-native-languages';
import { Dispatch } from 'react-redux';
import { configureApolloClient } from '../../ww-clients/apollo';

let apolloClient: ApolloClient<any>;

export const getApolloClient = (dispatch?: Dispatch<any>) => {
  if (!apolloClient) {
    apolloClient = configureApolloClient({
      dispatch,
      uri: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/graphql`,
      credentials: 'include',
      headers: {
        'Accept-Language': RNLanguages.language,
        'Cache-Control': 'no-store',
      },
    });
  }
  return apolloClient;
};
