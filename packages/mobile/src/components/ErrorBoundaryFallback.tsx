import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
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

export const ErrorBoundaryFallback: React.FC<FallbackProps> = () => {
  const [t] = useTranslation();
  return (
    <View style={styles.container}>
      <Icon icon="bug" />
      <Subheading>{t('commons:bug')}</Subheading>
    </View>
  );
};
