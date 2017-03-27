/**
 * Apollo client config to use with Meteor backend without Meteor on client side at all
 * Inspired by https://github.com/apollographql/meteor-integration/blob/master/main-client.js
 * https://github.com/orionsoft/meteor-apollo-accounts/blob/master/client/src/store.js
 */

import ApolloClient from 'apollo-client';
import { getLoginToken } from 'meteor-apollo-accounts';
// TODO: when apollo supports file uploads - replace this with official stuff
import { BatchedUploadHTTPFetchNetworkInterface } from './BatchedUploadHTTPFetchNetworkInterface';

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

const createMeteorNetworkInterface = () => {
  const networkInterface = new BatchedUploadHTTPFetchNetworkInterface('/graphql', 10);
  networkInterface.use([authMiddleware]);

  return networkInterface;
};

const meteorClientConfig = networkInterfaceConfig => ({
  networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),

  // Default to using Mongo _id, must use _id for queries.
  dataIdFromObject: (result) => {
    if (result._id && result.__typename) {
      const dataId = result.__typename + result._id;
      return dataId;
    }

    return null;
  },
});

export default function configureApolloClient(options = {}) {
  return new ApolloClient({ ...meteorClientConfig(), ...options });
}
