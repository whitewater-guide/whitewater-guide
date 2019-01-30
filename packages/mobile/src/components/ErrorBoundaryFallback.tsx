import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ErrorBoundaryFallbackInner: React.SFC<WithI18n & FallbackProps> = ({
  t,
}) => (
  <View style={styles.container}>
    <Icon icon="bug" />
    <Subheading>{t('commons:bug')}</Subheading>
  </View>
);

export const ErrorBoundaryFallback: React.ComponentType<
  FallbackProps
> = withI18n()(ErrorBoundaryFallbackInner);
