import React from 'react';

import { Screen } from '~/components/Screen';
import { SoftInputMode } from '~/components/SoftInput';
import { ChatProvider } from '~/features/chat';

import Chat from './Chat';
import { ChatNavProps } from './types';
import useChatHeaderTitle from './useChatHeaderTitle';

const ChatScreen: React.FC<ChatNavProps> = (props) => {
  const { route } = props;
  useChatHeaderTitle(props);

  return (
    <Screen softInputMode={SoftInputMode.ADJUST_RESIZE}>
      <ChatProvider>
        <Chat room={route.params.room} />
      </ChatProvider>
    </Screen>
  );
};

export default ChatScreen;
