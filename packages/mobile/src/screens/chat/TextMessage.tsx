import format from 'date-fns/format';
import { MatrixEvent } from 'matrix-js-sdk';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
  deleted: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletedIcon: {
    fontSize: 18,
    fontFamily:
      Platform.OS === 'android'
        ? 'MaterialCommunityIcons'
        : 'Material Design Icons',
    color: theme.colors.componentBorder,
  },
});

interface TextMessageProps {
  message: MatrixEvent;
  onLongPress?: (message: MatrixEvent) => void;
}

const TextMessage: FC<TextMessageProps> = ({ message, onLongPress }) => {
  const { t } = useTranslation();
  const handleLongPress = useCallback(() => {
    onLongPress?.(message);
  }, [message, onLongPress]);

  const content = getMessage(message);
  const redacted = message.isRedacted();

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

        {!!content && <Paragraph>{content}</Paragraph>}

        {redacted && (
          <View style={styles.deleted}>
            <Text style={styles.deletedIcon}>
              {String.fromCodePoint(985721)}
            </Text>
            <Caption>{' ' + t('screens:chat.message.deleted')}</Caption>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextMessage;
