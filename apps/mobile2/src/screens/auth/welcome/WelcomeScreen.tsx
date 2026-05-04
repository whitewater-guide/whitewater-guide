import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import AuthScreenBase from '../AuthScreenBase';
import type { WelcomeScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const { me } = useAuth();
  const user = me?.name || '';
  const onPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_WELCOME}`}>
      <View style={styles.body}>
        <Text variant="titleLarge">
          {t('screens:auth.welcome.title', { user })}
        </Text>
        <Text variant="bodyMedium">
          {t('screens:auth.welcome.description_unverified')}
        </Text>
      </View>
      <Button mode="contained" onPress={onPress} testID="auth:submit">
        {t('screens:auth.welcome.submit')}
      </Button>
    </AuthScreenBase>
  );
}
