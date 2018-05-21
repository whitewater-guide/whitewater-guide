import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { WithT } from '../i18n';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ErrorBoundaryFallbackInner: React.SFC<WithT & FallbackProps> = ({ t }) => (
  <View style={styles.container}>
    <Icon icon="bug" />
    <Subheading>{t('commons:bug')}</Subheading>
  </View>
);

export const ErrorBoundaryFallback: React.ComponentType<FallbackProps> = translate()(ErrorBoundaryFallbackInner);
