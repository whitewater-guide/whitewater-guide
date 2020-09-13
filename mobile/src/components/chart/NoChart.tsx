import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import theme from '../../theme';
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
  noData?: boolean;
}

export const NoChart: React.FC<Props> = ({ noData }) => {
  const [t] = useTranslation();
  const message = noData
    ? t('section:chart.noData')
    : t('section:chart.noGauge');
  return (
    <View style={styles.container} testID="no-chart-container">
      <Icon narrow={true} icon={noData ? 'magnify-close' : 'water-off'} />
      <Subheading>{message}</Subheading>
    </View>
  );
};