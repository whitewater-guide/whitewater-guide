import { useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Title } from 'react-native-paper';
import { AuthScreenBase } from '../AuthScreenBase';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

interface Props {
  verified: boolean;
}

export const WelcomeView: React.FC<Props> = ({ verified }) => {
  const { t } = useTranslation();
  const { popToTop } = useNavigation();
  const { me } = useAuth();
  const user = me ? me.name : '';
  const onPress = useCallback(() => popToTop(), [popToTop]);
  // TODO: check email link, resend link
  // good example here:
  // https://mobbin.design/static/media/iPhoneXs.b6dc293d.png
  const description =
    'screens:auth.welcome.description_' +
    (verified ? 'verified' : 'unverified');
  return (
    <AuthScreenBase>
      <View style={styles.body}>
        <Title>{t('screens:auth.welcome.title', { user })}</Title>
        <Paragraph>{t(description)}</Paragraph>
      </View>
      <Button mode="contained" onPress={onPress}>
        {t('screens:auth.welcome.submit')}
      </Button>
    </AuthScreenBase>
  );
};

WelcomeView.displayName = 'WelcomeView';
