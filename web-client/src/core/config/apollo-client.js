/**
 * Apollo client config to use with Meteor backend without Meteor on client side at all
 * Inspired by https://github.com/apollographql/meteor-integration/blob/master/main-client.js
 * https://github.com/orionsoft/meteor-apollo-accounts/blob/master/client/src/store.js
 */

import {createBatchingNetworkInterface} from 'apollo-client';
import {getLoginToken} from 'meteor-apollo-accounts';

const authMiddleware = {
  applyMiddleware: async (request, next) => {
    const userToken = await getLoginToken();
    if (!userToken) {
      next();
      return;
    }

    if (!request.options.headers)
      request.options.headers = new Headers();

    request.options.headers.Authorization = userToken;

    next();
  },
};

const createMeteorNetworkInterface = () => {
  const networkInterface = createBatchingNetworkInterface({
    uri: '/graphql',
    batchInterval: 10,
  });

  networkInterface.use([authMiddleware]);

  return networkInterface;
};

export const meteorClientConfig = (networkInterfaceConfig) => {
  return {
    networkInterface: createMeteorNetworkInterface(networkInterfaceConfig),

    // Default to using Mongo _id, must use _id for queries.
    dataIdFromObject: (result) => {
      if (result._id && result.__typename) {
        const dataId = result.__typename + result._id;
        return dataId;
      }

      return null;
    },
  };
};
