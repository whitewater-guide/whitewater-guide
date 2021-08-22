import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import theme from '~/theme';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
});

export const SignOutButton: React.FC = () => {
  const { service, loading } = useAuth();
  const signOut = useCallback(() => service.signOut(), [service]);
  const [t] = useTranslation();
  const onPress = useCallback(() => {
    Alert.alert(t('auth:logoutDialogTitle'), t('auth:logoutDialogMessage'), [
      { text: t('commons:no'), style: 'cancel' },
      { text: t('commons:yes'), style: 'destructive', onPress: signOut },
    ]);
  }, [t, signOut]);
  return (
    <Button
      mode="text"
      loading={loading}
      onPress={onPress}
      style={styles.button}
      color={theme.colors.error}
    >
      {t('myProfile:logout')}
    </Button>
  );
};
