import React from 'react';
import { Paragraph } from 'react-native-paper';

import { Screen } from '~/components/Screen';

import { ChatNavProps } from './types';

const ChatScreen: React.FC<ChatNavProps> = ({ route: { params } }) => {
  const { roomId, roomType } = params;

  return (
    <Screen>
      <Paragraph>chat</Paragraph>
      <Paragraph>{`${roomType}:${roomId}`}</Paragraph>
    </Screen>
  );
};

export default ChatScreen;
