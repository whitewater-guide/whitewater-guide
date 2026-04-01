import type { ApolloError } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import theme from '../theme';
import Icon from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  refetch?: () => void;
  loading?: boolean;
  error?: ApolloError | null;
}

function RetryPlaceholder({ refetch, loading }: Props) {
  const { t } = useTranslation();
  const { isInternetReachable } = useNetInfo();

  const labelKey = isInternetReachable ? 'commons:bug' : 'commons:offline';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Icon narrow icon="alert" />
        )}
      </View>
      <Text variant="titleMedium">{t(labelKey)}</Text>
      {!!refetch && (
        <Button
          textColor={theme.colors.primary}
          compact
          disabled={loading}
          onPress={refetch}
        >
          {t('commons:retry')}
        </Button>
      )}
    </View>
  );
}

export default memo(RetryPlaceholder);
