import React from 'react';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';
import { useChatClient } from '~/features/chat';

import Chat from './Chat';
import { ChatNavProps } from './types';
import useChatHeaderTitle from './useChatHeaderTitle';

const ChatScreen: React.FC<ChatNavProps> = (props) => {
  const { route } = props;
  const { loading } = useChatClient();
  useChatHeaderTitle(props);

  return (
    <Screen>
      {loading ? <Loading /> : <Chat roomId={route.params.roomId} />}
    </Screen>
  );
};

export default ChatScreen;
