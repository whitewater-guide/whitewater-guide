import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import theme from '~/theme';

import Icon from '../Icon';

const styles = StyleSheet.create({
  container: {
    width: theme.screenWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  reason?: 'offline' | 'noData' | 'noGauge';
}

const icons = {
  offline: 'cloud-off-outline',
  noData: 'magnify-close',
  noGauge: 'water-off',
};

export const NoChart: React.FC<Props> = ({ reason = 'noGauge' }) => {
  const { t } = useTranslation();
  const message =
    reason === 'offline' ? t('commons:offline') : t(`section:chart.${reason}`);

  return (
    <View style={styles.container} testID="no-chart-container">
      <Icon narrow icon={icons[reason]} />
      <Subheading>{message}</Subheading>
    </View>
  );
};
