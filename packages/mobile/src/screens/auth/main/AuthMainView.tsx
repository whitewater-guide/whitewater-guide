import { useAuth } from '@whitewater-guide/clients';
import Divider from 'components/Divider';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import theme from '../../../theme';
import Screens from '../../screen-names';
import { AuthScreenBase } from '../AuthScreenBase';
import { FacebookButton } from '../FacebookButton';
import LocalButton from './LocalButton';

const styles = StyleSheet.create({
  caption: {
    marginTop: theme.margin.single,
  },
  link: {
    color: theme.colors.primary,
  },
});

export const AuthMainView: React.FC = () => {
  const { loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const signIn = useCallback(() => navigate(Screens.Auth.SignIn), [navigate]);
  const showPolicy = useCallback(() => {
    navigate(Screens.WebView, {
      fixture: 'privacy_policy',
      title: t('commons:privacyPolicy'),
    });
  }, [navigate]);
  const showTerms = useCallback(() => {
    navigate(Screens.WebView, {
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
