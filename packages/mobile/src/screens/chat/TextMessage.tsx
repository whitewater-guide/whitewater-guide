import format from 'date-fns/format';
import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  onLongPress?: (message: MatrixEvent) => void;
}

const TextMessage: FC<TextMessageProps> = ({ message, onLongPress }) => {
  const handleLongPress = useCallback(() => {
    onLongPress?.(message);
  }, [message, onLongPress]);

  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Caption style={styles.sender}>
            {message.sender.rawDisplayName}
          </Caption>
          <Caption style={styles.date}>
            {format(message.getTs(), 'PPpp')}
          </Caption>
        </View>

        <Paragraph>{getMessage(message)}</Paragraph>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextMessage;
