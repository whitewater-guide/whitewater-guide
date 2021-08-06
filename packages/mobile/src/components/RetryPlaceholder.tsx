import { useNetInfo } from '@react-native-community/netinfo';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import { useDebouncedCallback } from 'use-debounce';

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
  refetch?: () => Promise<any>;
  loading?: boolean;
  labelKey?: string;
  buttonKey?: string;
}

const RetryPlaceholder = memo<Props>((props) => {
  const { refetch, loading, buttonKey = 'commons:retry' } = props;
  const onPress = useDebouncedCallback(() => {
    refetch?.();
  }, 1000);
  const { t } = useTranslation();
  const { isInternetReachable } = useNetInfo();
  const labelKey = isInternetReachable
    ? props.labelKey ?? 'commons:bug'
    : 'commons:offline';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Icon narrow icon="alert" />
        )}
      </View>
      <Subheading>{t(labelKey)}</Subheading>
      {!!refetch && (
        <Button
          color={theme.colors.primary}
          compact
          disabled={loading}
          onPress={onPress}
        >
          {t(buttonKey)}
        </Button>
      )}
    </View>
  );
});

export default RetryPlaceholder;
