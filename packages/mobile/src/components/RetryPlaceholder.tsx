import { ApolloError } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import stringify from 'fast-json-stable-stringify';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Caption, Subheading } from 'react-native-paper';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';

import copyAndToast from '~/utils/copyAndToast';

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
  copyBugReport: {
    position: 'absolute',
    bottom: (initialWindowMetrics?.insets.bottom ?? 0) + theme.margin.double,
    alignItems: 'center',
  },
});

interface Props {
  refetch?: () => void;
  loading?: boolean;
  labelKey?: string;
  buttonKey?: string;
  error?: ApolloError | null;
}

const RetryPlaceholder = memo<Props>((props) => {
  const { refetch, loading, buttonKey = 'commons:retry', error } = props;
  const { t } = useTranslation();
  const { isInternetReachable } = useNetInfo();

  const onPress = useDebouncedCallback(() => {
    refetch?.();
  }, 1000);

  const labelKey = isInternetReachable
    ? props.labelKey ?? 'commons:bug'
    : 'commons:offline';

  const copyBugReport = useCallback(() => {
    if (error) {
      copyAndToast(stringify(error));
    }
  }, [error]);

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

      {!!error && isInternetReachable && (
        <View style={styles.copyBugReport}>
          <TouchableOpacity onPress={copyBugReport}>
            <Caption>{t('commons:copyBugReport')}</Caption>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

RetryPlaceholder.displayName = 'RetryPlaceholder';

export default RetryPlaceholder;
