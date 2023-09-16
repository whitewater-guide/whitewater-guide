import React from 'react';

import { Screen } from '~/components/Screen';
import { ChatProvider } from '~/features/chat';

import Chat from './Chat';
import type { ChatNavProps } from './types';
import useChatHeaderTitle from './useChatHeaderTitle';

const ChatScreen: React.FC<ChatNavProps> = (props) => {
  const { route } = props;
  useChatHeaderTitle(props);

  return (
    <Screen>
      <ChatProvider>
        <Chat room={route.params.room} />
      </ChatProvider>
    </Screen>
  );
};

export default ChatScreen;
