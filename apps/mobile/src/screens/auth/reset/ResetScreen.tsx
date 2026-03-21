import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

import theme from '~/theme';

import { AuthScreenBase } from '../AuthScreenBase';
import MissingParams from './MissingParams';
import { ResetForm } from './ResetForm';
import type { AuthResetNavProps } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.margin.double,
  },
});

const ResetScreen: React.FC<AuthResetNavProps> = ({ route }) => {
  const { id, token } = route.params ?? {};
  const { t } = useTranslation();
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <View style={styles.container}>
        <Title>{t('screens:auth.reset.title')}</Title>
        <Paragraph>{t('screens:auth.reset.description')}</Paragraph>
        {!!id && !!token ? (
          <ResetForm
            id={id}
            token={token}
            keyboardScrollRef={keyboardScrollRef}
          />
        ) : (
          <MissingParams />
        )}
      </View>
    </AuthScreenBase>
  );
};

export default ResetScreen;
