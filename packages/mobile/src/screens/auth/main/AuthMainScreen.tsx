import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import Divider from '~/components/Divider';
import { Screens } from '~/core/navigation';
import theme from '../../../theme';
import { AuthScreenBase } from '../AuthScreenBase';
import { FacebookButton } from '../FacebookButton';
import LocalButton from './LocalButton';
import { AuthMainNavProps } from './types';

const styles = StyleSheet.create({
  caption: {
    marginTop: theme.margin.single,
  },
  link: {
    color: theme.colors.primary,
  },
});

const AuthMainScreen: React.FC<AuthMainNavProps> = ({ navigation }) => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = navigation;
  const signIn = useCallback(() => navigate(Screens.AUTH_SIGN_IN), [navigate]);
  const showPolicy = useCallback(() => {
    navigate(Screens.WEB_VIEW, {
      fixture: 'privacy_policy',
      title: t('commons:privacyPolicy'),
    });
  }, [navigate]);
  const showTerms = useCallback(() => {
    navigate(Screens.WEB_VIEW, {
      fixture: 'terms_and_conditions',
      title: t('commons:termsOfService'),
    });
  }, [navigate]);
  return (
    <AuthScreenBase>
      <View>
        <LocalButton label={t('screens:auth.main.local')} />
        <FacebookButton label={t('screens:auth.main.facebook')} />
        <Caption style={styles.caption}>
          {t('screens:auth.main.legalNotice') + ' '}
          <Text style={styles.link} onPress={showPolicy}>
            {t('screens:auth.main.privacyPolicy')}
          </Text>
          {' ' + t('commons:and') + ' '}
          <Text style={styles.link} onPress={showTerms}>
            {t('screens:auth.main.termsOfService')}
          </Text>
          {t('screens:auth.main.legalNotice2')}
        </Caption>
      </View>
      <View>
        <Divider label={t('screens:auth.main.gotAccount')} />
        <Button
          mode="text"
          onPress={signIn}
          disabled={loading}
          testID="auth-main-signin"
        >
          {t('screens:auth.main.signin')}
        </Button>
      </View>
    </AuthScreenBase>
  );
};

export default AuthMainScreen;
