import { useNetInfo } from '@react-native-community/netinfo';
import { EventType, MatrixEvent } from 'matrix-js-sdk';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Caption } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface ChatFooterProps {
  lastEvent?: MatrixEvent;
  loading?: boolean;
  loadOlder?: () => Promise<void>;
}

const ChatFooter: FC<ChatFooterProps> = ({ lastEvent, loading, loadOlder }) => {
  const type = lastEvent?.getType();
  const { t } = useTranslation();
  const { isInternetReachable } = useNetInfo();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
        {isInternetReachable && <Caption>{t('commons:offline')}</Caption>}
      </View>
    );
  }

  if (type === EventType.RoomCreate) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button onPress={loadOlder} disabled={loading}>
        {t('screens:chat.loadOlder')}
      </Button>
    </View>
  );
};

export default ChatFooter;
