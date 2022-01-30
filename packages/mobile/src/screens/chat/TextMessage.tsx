import { MyProfileFragment } from '@whitewater-guide/schema';
import formatRelative from 'date-fns/formatRelative';
import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Caption, Paragraph, Surface } from 'react-native-paper';

import { getMessage } from '~/features/chat';
import theme from '~/theme';

const styles = StyleSheet.create({
  myMessage: {
    padding: theme.margin.double,
    marginBottom: theme.margin.double,
    marginLeft: theme.screenWidth / 8, // TODO: avatar width + padding
    backgroundColor: theme.colors.primaryLighter,
    alignItems: 'flex-end',
    borderRadius: theme.rounding.double,
  },
  otherMessage: {
    alignItems: 'flex-start',
    borderRadius: theme.rounding.double,
    padding: theme.margin.double,
    marginBottom: theme.margin.double,
    marginRight: theme.screenWidth / 8,
  },
  sender: {
    color: theme.colors.primary,
  },
  date: {
    alignSelf: 'flex-end',
  },
});

interface TextMessageProps {
  message: MatrixEvent;
  me?: MyProfileFragment | null;
}

const TextMessage: FC<TextMessageProps> = ({ message, me }) => {
  const isMine = !!me?.id && message.sender.userId.includes(me.id);

  return (
    <Surface style={isMine ? styles.myMessage : styles.otherMessage}>
      {!isMine && (
        <Caption style={styles.sender}>{message.sender.rawDisplayName}</Caption>
      )}
      <Paragraph>{getMessage(message)}</Paragraph>
      <Caption style={styles.date}>
        {formatRelative(message.getTs(), Date.now())}
      </Caption>
    </Surface>
  );
};

export default TextMessage;
