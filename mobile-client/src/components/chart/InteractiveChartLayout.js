import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const InteractiveChart = ({ chart, flowToggle, periodToggle }) => (
  <View style={styles.container}>
    { flowToggle }
    { chart }
    { periodToggle }
  </View>
);

InteractiveChart.propTypes = {
  chart: PropTypes.element.isRequired,
  flowToggle: PropTypes.element.isRequired,
  periodToggle: PropTypes.element.isRequired,
};

export default InteractiveChart;
