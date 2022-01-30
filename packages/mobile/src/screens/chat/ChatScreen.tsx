import React from 'react';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';
import { useChatClient } from '~/features/chat';

import Chat from './Chat';
import { ChatNavProps } from './types';

const ChatScreen: React.FC<ChatNavProps> = ({
  route: {
    params: { roomId },
  },
}) => {
  const { loading } = useChatClient();

  return <Screen>{loading ? <Loading /> : <Chat roomId={roomId} />}</Screen>;
};

export default ChatScreen;
