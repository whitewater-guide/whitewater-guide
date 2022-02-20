import format from 'date-fns/format';
import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Paragraph } from 'react-native-paper';

import { getMessage } from '~/features/chat';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
    marginVertical: theme.margin.single,
    backgroundColor: theme.colors.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sender: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  date: {
    alignSelf: 'flex-end',
  },
});

interface TextMessageProps {
  message: MatrixEvent;
}

const TextMessage: FC<TextMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Caption style={styles.sender}>{message.sender.rawDisplayName}</Caption>
        <Caption style={styles.date}>{format(message.getTs(), 'PPpp')}</Caption>
      </View>

      <Paragraph>{getMessage(message)}</Paragraph>
    </View>
  );
};

export default TextMessage;
