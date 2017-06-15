import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import RangeSlider from './slider/RangeSlider';

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: -10,
  },
});

const MultiSlider = ({ label, ...props }) => (
  <View style={styles.sliderWrapper}>
    <Text paddingHorizontal={10}>{label}</Text>
    <RangeSlider {...props} />
  </View>
);

MultiSlider.propTypes = {
  ...RangeSlider.propTypes,
  label: PropTypes.string.isRequired,
};

export default MultiSlider;
