import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { WithT } from '../../i18n';
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

interface Props extends WithT {
  noData?: boolean;
}

const NoChart: React.StatelessComponent<Props> = ({ noData, t }) => {
  const message = noData ? t('section:chart.noData') : t('section:chart.noGauge');
  return (
    <View style={styles.container}>
      <Icon narrow icon="warning" />
      <Subheading>{message}</Subheading>
    </View>
  );
};

export default translate()(NoChart);
