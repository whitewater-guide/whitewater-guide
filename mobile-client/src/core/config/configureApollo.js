import { setTokenStore } from 'meteor-apollo-accounts';
import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';
import { configureApolloClient } from '../../commons/apollo';

setTokenStore({
  set: async function ({ userId, token, tokenExpires }) {
    await AsyncStorage.setItem('Meteor.userId', userId);
    await AsyncStorage.setItem('Meteor.loginToken', token);
    // AsyncStorage doesn't support Date type so we'll store it as a String
    await AsyncStorage.setItem('Meteor.loginTokenExpires', tokenExpires.toString());
  },
  get: async function () {
    return {
      userId: await AsyncStorage.getItem('Meteor.userId'),
      token: await AsyncStorage.getItem('Meteor.loginToken'),
      tokenExpires: await AsyncStorage.getItem('Meteor.loginTokenExpires'),
    };
  },
});

export const apolloClient = configureApolloClient({
  uri: Config.GRAPHQL_ENDPOINT,
  subs: Config.SUBS_ENDPOINT,
  reduxRootSelector: state => state.persistent.apollo,
});
