import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import theme from '../../theme';
import { Icon } from '../Icon';

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

const NoChartInternal: React.StatelessComponent<Props & WithI18n> = ({ noData, t }) => {
  const message = noData ? t('section:chart.noData') : t('section:chart.noGauge');
  return (
    <View style={styles.container}>
      <Icon narrow icon="alert" />
      <Subheading>{message}</Subheading>
    </View>
  );
};

export const NoChart = withI18n()(NoChartInternal);
