import { useAuth } from '@whitewater-guide/clients';
import type { MatrixClient } from 'matrix-js-sdk';
import { ClientEvent, createClient, Filter } from 'matrix-js-sdk';
import type { FC, PropsWithChildren } from 'react';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import DeviceInfo from 'react-native-device-info';

import Loading from '~/components/Loading';
import { tokenStorage } from '~/core/auth';
import { CHAT_DOMAIN, CHAT_URL } from '~/utils/urls';

import { MESSAGES_IN_BATCH } from './constants';

const client = createClient({
  baseUrl: CHAT_URL,
  deviceId: DeviceInfo.getUniqueIdSync(),
  timelineSupport: true,
});

export interface ChatClientState {
  prepared: boolean;
  /**
   * User id in terms of matrix ("#<uuid>@whitewater.guide")
   */
  userId?: string;
}

const ChatClientStateCtx = createContext<ChatClientState>({
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
    prepared: false,
  });

  const myId = me?.id;
  const myName = useRef(me?.name);
  myName.current = me?.name;

  useEffect(() => {
    if (!myId) {
      setState({ userId: undefined, prepared: false });
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
        setState((s) => ({
          ...s,
          loggedIn: true,
          userId: `#${myId}@${CHAT_DOMAIN}`,
        }));
        if (myName.current) {
          client.setDisplayName(myName.current);
        }
      });

    return () => {
      client
        .off(ClientEvent.Sync, onSync)
        .logout()
        .then(() => {
          setState({ userId: undefined, prepared: false });
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
  const { prepared, userId } = useContext(ChatClientStateCtx);

  useEffect(() => {
    if (!userId) {
      return;
    }
    // TODO: reuse filter
    client.startClient({
      disablePresence: true,
      filter: Filter.fromJson(userId, '0', {
        room: {
          state: {
            lazy_load_members: true,
            include_redundant_members: false,
            limit: MESSAGES_IN_BATCH,
          },
          timeline: {
            lazy_load_members: true,
            include_redundant_members: false,
            limit: MESSAGES_IN_BATCH,
          },
        },
      }),
    });

    return () => {
      client.stopClient();
    };
  }, [userId]);

  return (
    <ChatCtx.Provider value={client}>
      {!!userId && prepared ? children : <Loading />}
    </ChatCtx.Provider>
  );
};

/**
 * This hook returns matrix client. It works when not inside ChatProvider, because context has defaultValue
 * @returns MatrixClient
 */
export const useChatClient = () => useContext(ChatCtx);
