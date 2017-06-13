import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';

const InteractiveChart = ({ chart, flowToggle, periodToggle }) => (
  <View >
    { flowToggle }
    { chart }
    { periodToggle }
  </View>
);

InteractiveChart.propTypes = {
  chart: PropTypes.element.isRequired,
  flowToggle: PropTypes.element,
  periodToggle: PropTypes.element,
};

export default InteractiveChart;
