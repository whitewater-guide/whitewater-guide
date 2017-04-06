import React, { PropTypes } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  chip: {
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    margin: 2,
  },
  chipText: {
    fontSize: 12,
  },
});

const Chip = ({ color, label }) => (
  <View style={[{ borderColor: color }, styles.chip]}>
    <Text style={[{ color }, styles.chipText]}>{label}</Text>
  </View>
);

Chip.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string.isRequired,
};

Chip.defaultProps = {
  color: 'black',
};

export default Chip;
