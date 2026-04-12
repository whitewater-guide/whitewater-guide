import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import Icon from '../Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ICONS = {
  offline: 'cloud-off-outline',
  noData: 'magnify-close',
  noGauge: 'water-off',
} as const;

interface Props {
  reason?: 'offline' | 'noData' | 'noGauge';
}

function NoChart({ reason = 'noGauge' }: Props) {
  const { t } = useTranslation();
  const message =
    reason === 'offline' ? t('commons:offline') : t(`section:chart.${reason}`);
  return (
    <View style={styles.container} testID="no-chart-container">
      <Icon narrow icon={ICONS[reason]} />
      <Text variant="titleMedium">{message}</Text>
    </View>
  );
}

export default NoChart;
