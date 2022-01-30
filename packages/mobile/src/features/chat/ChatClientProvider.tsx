import './polyfill';

import { useAuth } from '@whitewater-guide/clients';
import { createClient, MatrixClient } from 'matrix-js-sdk';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import DeviceInfo from 'react-native-device-info';

import { tokenStorage } from '~/core/auth';

const client = createClient({
  baseUrl: 'http://localhost:8008',
  deviceId: DeviceInfo.getUniqueId(),
});

export interface ChatClientContext {
  loading: boolean;
  client: MatrixClient;
}

const ChatClientCtx = createContext<ChatClientContext>({
  client,
  loading: true,
});

export const ChatClientProvider: FC = ({ children }) => {
  const { me, service } = useAuth();
  const [loading, setLoading] = useState(true);
  const myId = me?.id;

  useEffect(() => {
    if (!myId) {
      return;
    }

    const onSync = (state: string) => {
      if (state === 'PREPARED') {
        setLoading(false);
      }
    };
    client.on('sync', onSync);

    tokenStorage
      .getAccessToken()
      .then((token) => client.login('org.matrix.login.jwt', { token }))
      .then(() => client.startClient({ initialSyncLimit: 30 }));

    return () => {
      client.off('sync', onSync);
      client.stopClient();
      client.logout();
    };
  }, [myId, service, setLoading]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ChatClientCtx.Provider value={{ client, loading }}>
      {children}
    </ChatClientCtx.Provider>
  );
};

export const useChatClient = () => useContext(ChatClientCtx);
