import { useAuth } from '@whitewater-guide/clients';
import { ClientEvent, createClient, MatrixClient } from 'matrix-js-sdk';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import DeviceInfo from 'react-native-device-info';

import Loading from '~/components/Loading';
import { tokenStorage } from '~/core/auth';
import { CHAT_URL } from '~/utils/urls';

const client = createClient({
  baseUrl: CHAT_URL,
  deviceId: DeviceInfo.getUniqueIdSync(),
});

export interface ChatClientState {
  loggedIn: boolean;
  prepared: boolean;
}

const ChatClientStateCtx = createContext<ChatClientState>({
  loggedIn: false,
  prepared: false,
});

/**
 * This is top-level chat provider, it should be placed among top-level App provieders, inside AuthProvider
 * It's responsible for logging in/out into matrix server when user logs in/out of the app.
 * It's also reponsible for tracking 'prepared' state [link](http://matrix-org.github.io/matrix-js-sdk/15.5.2/module-client.html#~event:MatrixClient%2522sync%2522)
 * This state means that the client has synced with the server at least once and is ready for methods to be called on it.
 *
 * This provider doesn't start the client, because we're using matrix in "comments" mode (not live mode, as opposed to "chat" mode with notifications, unread count, etc.)
 *
 * @returns
 */
export const ChatClientStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { me, service } = useAuth();
  const [state, setState] = useState<ChatClientState>({
    loggedIn: false,
    prepared: false,
  });

  const myId = me?.id;
  const myName = useRef(me?.name);
  myName.current = me?.name;

  useEffect(() => {
    if (!myId) {
      setState({ loggedIn: false, prepared: false });
      return;
    }

    const onSync = (state: string) => {
      if (state === 'PREPARED') {
        setState((s) => ({ ...s, prepared: true }));
      }
    };
    client.on(ClientEvent.Sync, onSync);

    tokenStorage
      .getAccessToken()
      .then(async (token) => {
        await client.login('org.matrix.login.jwt', { token });
      })
      .then(() => {
        setState((s) => ({ ...s, loggedIn: true }));
        if (myName.current) {
          client.setDisplayName(myName.current);
        }
      });

    return () => {
      client
        .off(ClientEvent.Sync, onSync)
        .logout()
        .then(() => {
          setState({ loggedIn: false, prepared: false });
        });
    };
  }, [myId, myName, service, setState]);

  return (
    <ChatClientStateCtx.Provider value={state}>
      {children}
    </ChatClientStateCtx.Provider>
  );
};

const ChatCtx = createContext<MatrixClient>(client);

/**
 * This provider is used to wrap chat screen. It connects to matrix served and starts syncing when on this screen, and disconnects when screen is unmounted.
 * It provides chat client instance to all the children of chat screen
 * @returns
 */
export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const { prepared, loggedIn } = useContext(ChatClientStateCtx);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    client.startClient({
      initialSyncLimit: 30,
      disablePresence: true,
      lazyLoadMembers: true,
    });

    return () => {
      client.stopClient();
    };
  }, [loggedIn]);

  return (
    <ChatCtx.Provider value={client}>
      {loggedIn && prepared ? children : <Loading />}
    </ChatCtx.Provider>
  );
};

/**
 * This hook returns matrix client. It works when not inside ChatProvider, because context has defaultValue
 * @returns MatrixClient
 */
export const useChatClient = () => useContext(ChatCtx);
