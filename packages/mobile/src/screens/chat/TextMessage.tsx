import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph, Surface } from 'react-native-paper';

import { getMessage } from '~/features/chat';
import theme from '~/theme';

const styles = StyleSheet.create({
  msg: {
    padding: theme.margin.double,
    marginBottom: theme.margin.double,
  },
});

interface TextMessageProps {
  message: MatrixEvent;
}

const TextMessage: FC<TextMessageProps> = ({ message }) => {
  return (
    <Surface style={styles.msg}>
      <Paragraph>{getMessage(message)}</Paragraph>
    </Surface>
  );
};

export default TextMessage;
