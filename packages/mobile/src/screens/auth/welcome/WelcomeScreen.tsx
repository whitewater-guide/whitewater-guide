import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Title } from 'react-native-paper';

import { AuthScreenBase } from '../AuthScreenBase';
import type { AuthWelcomeNavProps } from './types';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

const WelcomeScreen: React.FC<AuthWelcomeNavProps> = ({
  route,
  navigation,
}) => {
  const verified = route.params?.verified;
  const { t } = useTranslation();
  const { me } = useAuth();
  const user = me?.name || '';
  const onPress = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);
  // TODO: check email link, resend link
  // good example here:
  // https://mobbin.design/static/media/iPhoneXs.b6dc293d.png
  const description = `screens:auth.welcome.description_${
    verified ? 'verified' : 'unverified'
  }`;
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

export default WelcomeScreen;
