import { useNetworkState } from 'expo-network';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface RetryPlaceholderProps {
  refetch?: () => void;
  loading?: boolean;
}

function RetryPlaceholder({ refetch, loading }: RetryPlaceholderProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isInternetReachable } = useNetworkState();

  const labelKey =
    isInternetReachable === false ? 'commons:offline' : 'commons:bug';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Icon narrow icon="alert" />
        )}
      </View>
      <ThemedText type="smallBold">{t(labelKey)}</ThemedText>
      {!!refetch && (
        <Pressable
          disabled={loading}
          onPress={refetch}
          style={styles.retry}
        >
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {t('commons:retry')}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

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
  retry: {
    marginTop: Spacing.two,
    padding: Spacing.two,
  },
});

export default memo(RetryPlaceholder);
