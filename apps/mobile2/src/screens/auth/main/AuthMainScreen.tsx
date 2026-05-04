import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import Divider from '../../../components/Divider';
import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import AuthScreenBase from '../AuthScreenBase';
import type { AuthMainScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  caption: {
    marginTop: theme.margin.single,
  },
  link: {
    color: theme.colors.primary,
  },
});

export function AuthMainScreen({ navigation }: AuthMainScreenProps) {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = navigation;
  const register = useCallback(
    () => navigate(Screens.AUTH_REGISTER),
    [navigate],
  );
  const signIn = useCallback(() => navigate(Screens.AUTH_SIGN_IN), [navigate]);
  const showPolicy = useCallback(() => {
    navigation.getParent()?.navigate(Screens.WEB_VIEW, {
      fixture: 'privacy_policy',
      title: t('commons:privacyPolicy'),
    });
  }, [navigation, t]);
  const showTerms = useCallback(() => {
    navigation.getParent()?.navigate(Screens.WEB_VIEW, {
      fixture: 'terms_and_conditions',
      title: t('commons:termsOfService'),
    });
  }, [navigation, t]);

  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_MAIN}`}>
      <View>
        <Button
          mode="contained"
          icon="email"
          onPress={register}
          testID="auth:register"
        >
          {t('screens:auth.main.local')}
        </Button>
        <Text variant="bodySmall" style={styles.caption}>
          {`${t('screens:auth.main.legalNotice')} `}
          <Text style={styles.link} onPress={showPolicy}>
            {t('screens:auth.main.privacyPolicy')}
          </Text>
          {` ${t('commons:and')} `}
          <Text style={styles.link} onPress={showTerms}>
            {t('screens:auth.main.termsOfService')}
          </Text>
          {t('screens:auth.main.legalNotice2')}
        </Text>
      </View>
      <View>
        <Divider label={t('screens:auth.main.gotAccount')} />
        <Button
          mode="text"
          onPress={signIn}
          disabled={loading}
          testID="auth:sign-in"
        >
          {t('screens:auth.main.signin')}
        </Button>
      </View>
    </AuthScreenBase>
  );
}
