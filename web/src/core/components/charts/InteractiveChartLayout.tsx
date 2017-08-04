import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const InteractiveChart = ({ chart, flowToggle, periodToggle }) => (
  <div style={styles.container}>
    <div style={styles.buttonContainer}>
      { periodToggle }
      { flowToggle }
    </div>
    { chart }
  </div>
);

InteractiveChart.propTypes = {
  chart: PropTypes.element.isRequired,
  flowToggle: PropTypes.element.isRequired,
  periodToggle: PropTypes.element.isRequired,
};

export default InteractiveChart;
