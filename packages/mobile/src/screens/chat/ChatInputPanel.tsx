import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import Icon from '~/components/Icon';
import { useChatClient } from '~/features/chat';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.margin.double,
    paddingTop: theme.margin.double,
    paddingBottom: Math.max(theme.margin.double, theme.safeBottom),

    backgroundColor: theme.colors.lightBackground,
    borderTopColor: theme.colors.border,
    borderTopWidth: theme.border,
  },
  input: {
    flex: 1,
    marginRight: theme.margin.double,
    maxHeight: 150,
  },
});

interface ChatInputPanelProps {
  roomId: string;
}

const ChatInputPanel: FC<ChatInputPanelProps> = ({ roomId }) => {
  const { client } = useChatClient();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();

  const handlePress = () => {
    const msg = text.trim();
    setText('');
    Keyboard.dismiss();
    if (msg.length) {
      setSending(true);
      client.sendTextMessage(roomId, msg).finally(() => {
        setSending(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
        placeholder={t('screens:chat.inputPlaceholder')}
      />
      <Icon
        icon="send"
        color={theme.colors.primary}
        onPress={handlePress}
        disabled={sending}
        hitSlop={{ left: 8, bottom: 8, right: 8, top: 8 }}
      />
    </View>
  );
};

export default ChatInputPanel;
