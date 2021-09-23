import { ApolloError } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Caption, Subheading } from 'react-native-paper';

import Icon from '~/components/Icon';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    height: 5 * theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margin.double,
    marginHorizontal: theme.margin.double,
  },
});

interface Props {
  error?: ApolloError;
  refetch?: () => Promise<any>;
}

const LoadingSummary: React.FC<Props> = ({ error, refetch }) => {
  const { t } = useTranslation();
  const { isConnected } = useNetInfo();
  const onPress = useCallback(() => {
    if (refetch) {
      refetch().catch(() => {
        // ignore
      });
    }
  }, [refetch]);
  if (error) {
    return (
      <View style={styles.container}>
        <Icon icon="alert" />
        <Subheading>
          {t('offline:dialog.summaryError')}{' '}
          {!isConnected && (
            <Subheading>{t('commons:checkConnection')}</Subheading>
          )}
        </Subheading>
        <Button color={theme.colors.primary} compact onPress={onPress}>
          {t('commons:retry')}
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} />
      <Caption>{t('offline:dialog.loadingSummary')}</Caption>
    </View>
  );
};

export default LoadingSummary;
