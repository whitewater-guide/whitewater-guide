/**
 * Apollo client config to use with Meteor backend without Meteor on client side at all
 * Inspired by https://github.com/apollographql/meteor-integration/blob/master/main-client.js
 * https://github.com/orionsoft/meteor-apollo-accounts/blob/master/client/src/store.js
 */

import ApolloClient from 'apollo-client';
import { getLoginToken } from 'meteor-apollo-accounts';
import { HTTPBatchedNetworkInterface } from 'apollo-client/transport/batchedNetworkInterface';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
// TODO: when apollo supports file uploads - replace this with official stuff
import { BatchedUploadHTTPFetchNetworkInterface } from './BatchedUploadHTTPFetchNetworkInterface';
import isNative from '../core/isNative';

async function applyAuth(request, next) {
  const userToken = await getLoginToken();
  if (!userToken) {
    next();
    return;
  }

  if (!request.options.headers) {
    request.options.headers = {};
  }

  request.options.headers['meteor-login-token'] = userToken;

  next();
}

const authMiddleware = {
  applyMiddleware: applyAuth,
  applyBatchMiddleware: applyAuth,
};

const createMeteorNetworkInterface = ({ uri = '/graphql', subs }) => {
  // React-native doesn't support uploads (File class in particular breaks it)
  const networkInterface = isNative() ?
    new HTTPBatchedNetworkInterface(uri, 10) :
    new BatchedUploadHTTPFetchNetworkInterface(uri, 10);
  networkInterface.use([authMiddleware]);

  if (subs) {
    return addGraphQLSubscriptions(
      networkInterface,
      new SubscriptionClient(subs, { reconnect: true }),
    );
  }
  return networkInterface;
};

const meteorClientConfig = networkInterfaceConfig => ({
  networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),
});

export default function configureApolloClient(options = {}) {
  return new ApolloClient({ ...meteorClientConfig(options), ...options });
}
