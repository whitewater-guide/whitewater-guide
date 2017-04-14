import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import capitalize from 'lodash/capitalize'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    marginLeft: 8,
  },
});

const ChartFlowToggle = ({ value, onChange }) => (
  <View style={styles.container}>
    <Text>{capitalize(value)}</Text>
    <Switch
      value={value === 'flow'}
      onValueChange={v => onChange(v ? 'flow' : 'level')}
    />
  </View>
);

ChartFlowToggle.propTypes = {
  value: PropTypes.oneOf(['flow', 'level']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChartFlowToggle;
