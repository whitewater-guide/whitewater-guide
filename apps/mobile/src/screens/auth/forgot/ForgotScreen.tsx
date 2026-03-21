import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

import theme from '~/theme';

import { AuthScreenBase } from '../AuthScreenBase';
import { ForgotForm } from './ForgotForm';
import type { AuthForgotNavProps } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.margin.double,
  },
});

const ForgotScreen: React.FC<AuthForgotNavProps> = () => {
  const { t } = useTranslation();
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <View style={styles.container}>
        <Title>{t('screens:auth.forgot.title')}</Title>
        <Paragraph>{t('screens:auth.forgot.description')}</Paragraph>
        <ForgotForm keyboardScrollRef={keyboardScrollRef} />
      </View>
    </AuthScreenBase>
  );
};

export default ForgotScreen;
