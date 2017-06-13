import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ListItem } from '../index';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 4,
  },
});

const ChartPeriodToggle = ({ onChange }) => (
  <ListItem style={styles.container}>
    <Button small primary style={styles.button} label="Daily" onPress={() => onChange(1)} />
    <Button small primary style={styles.button} label="Weekly" onPress={() => onChange(7)} />
    <Button small primary style={styles.button} label="Monthly" onPress={() => onChange(31)} />
  </ListItem>
);

ChartPeriodToggle.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ChartPeriodToggle;
