import PropTypes from 'prop-types';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  button: {
    marginRight: 8,
    width: 120,
    height: 40,
  },
};

const ChartPeriodToggle = ({ onChange }) => (
  <div>
    <RaisedButton label="One day" primary style={styles.button} onTouchTap={() => onChange(1)} />
    <RaisedButton label="One week" primary style={styles.button} onTouchTap={() => onChange(7)} />
    <RaisedButton label="One month" primary style={styles.button} onTouchTap={() => onChange(31)} />
  </div>
);

ChartPeriodToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ChartPeriodToggle;
