import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Caption } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

import { AuthScreenBase } from '../AuthScreenBase';
import AppleButton from './AppleButton';
import { FacebookButton } from './FacebookButton';
import type { AuthMainNavProps } from './types';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  caption: {
    marginTop: theme.margin.single,
  },
  link: {
    color: theme.colors.primary,
  },
});

const AuthSocialScreen: React.FC<AuthMainNavProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { navigate } = navigation;

  const showPolicy = useCallback(() => {
    navigate(Screens.WEB_VIEW, {
      fixture: 'privacy_policy',
      title: t('commons:privacyPolicy'),
    });
  }, [navigate, t]);

  const showTerms = useCallback(() => {
    navigate(Screens.WEB_VIEW, {
      fixture: 'terms_and_conditions',
      title: t('commons:termsOfService'),
    });
  }, [navigate, t]);

  return (
    <AuthScreenBase>
      <View style={styles.container}>
        <FacebookButton label={t('screens:auth.social.facebook')} />
        {Platform.OS === 'ios' && <AppleButton />}
        <Caption style={styles.caption}>
          {`${t('screens:auth.main.legalNotice')} `}
          <Text style={styles.link} onPress={showPolicy}>
            {t('screens:auth.main.privacyPolicy')}
          </Text>
          {` ${t('commons:and')} `}
          <Text style={styles.link} onPress={showTerms}>
            {t('screens:auth.main.termsOfService')}
          </Text>
          {t('screens:auth.main.legalNotice2')}
        </Caption>
      </View>
    </AuthScreenBase>
  );
};

export default AuthSocialScreen;
