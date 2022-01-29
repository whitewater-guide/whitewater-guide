import './polyfill';

import { useAuth } from '@whitewater-guide/clients';
import * as sdk from 'matrix-js-sdk';
import React, { createContext, FC, useContext, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

import { tokenStorage } from '~/core/auth';

const client = sdk.createClient({
  baseUrl: 'http://localhost:8008',
  deviceId: DeviceInfo.getUniqueId(),
});

const ChatClientCtx = createContext<sdk.MatrixClient>(client);

export const ChatClientProvider: FC = ({ children }) => {
  const { me, service } = useAuth();
  const myId = me?.id;

  useEffect(() => {
    if (!myId) {
      return;
    }

    tokenStorage
      .getAccessToken()
      .then((token) => client.login('org.matrix.login.jwt', { token }))
      .then(() => client.startClient({}));

    return () => {
      client.stopClient();
      client.logout();
    };
  }, [myId, service]);

  return (
    <ChatClientCtx.Provider value={client}>{children}</ChatClientCtx.Provider>
  );
};

export const useChatClient = () => useContext(ChatClientCtx);
