import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, Icon } from '../index';
import I18n from '../../i18n';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const NoChart = ({ noData }) => {
  const message = noData ? I18n.t('section.chart.noData') : I18n.t('section.chart.noGauge');
  return (
    <View style={styles.container}>
      <Icon narrow icon="warning" />
      <Text>{message}</Text>
    </View>
  );
};

NoChart.propTypes = {
  noData: PropTypes.bool,
};

NoChart.defaultProps = {
  noData: false,
};

export default NoChart;
