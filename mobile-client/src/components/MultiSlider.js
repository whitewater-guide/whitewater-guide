import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import RangeSlider from './slider/RangeSlider';

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: -10,
  },
  labelStyle: {
    paddingHorizontal: 10,
  }
});

const MultiSlider = ({ label, ...props }) => (
  <View style={styles.sliderWrapper}>
    <Text style={styles.labelStyle}>{label}</Text>
    <RangeSlider {...props} />
  </View>
);

MultiSlider.propTypes = {
  ...RangeSlider.propTypes,
  label: PropTypes.string.isRequired,
};

export default MultiSlider;
