import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const InteractiveChart = ({ chart, flowToggle, periodToggle }) => (
  <View >
    <View style={styles.buttonContainer}>
      { periodToggle }
      { flowToggle }
    </View>
    { chart }
  </View>
);

InteractiveChart.propTypes = {
  chart: PropTypes.element.isRequired,
  flowToggle: PropTypes.element.isRequired,
  periodToggle: PropTypes.element.isRequired,
};

export default InteractiveChart;
