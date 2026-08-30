import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';

const ICONS = {
  offline: 'cloud-off-outline',
  noData: 'magnify-close',
  noGauge: 'water-off',
} as const;

export type NoChartReason = 'offline' | 'noData' | 'noGauge';

export interface NoChartProps {
  reason?: NoChartReason;
}

export function NoChart({ reason = 'noGauge' }: NoChartProps) {
  const { t } = useTranslation();
  const message =
    reason === 'offline' ? t('commons:offline') : t(`section:chart.${reason}`);
  return (
    <View style={styles.container} testID="no-chart-container">
      <Icon narrow icon={ICONS[reason]} />
      <ThemedText type="smallBold">{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
