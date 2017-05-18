import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Slider from '@ptomasroos/react-native-multi-slider';
import theme from '../theme/variables/platform';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginBottom: -32,
  },
  selectedTrack: {
    backgroundColor: theme.btnPrimaryBg,
  },
  marker: {
    backgroundColor: theme.btnPrimaryBg,
  },
});

const MultiSlider = ({ label, ...props }) => (
  <View style={styles.sliderWrapper}>
    <Text style={{ paddingBottom: 8 }}>{label}</Text>
    <Slider
      selectedStyle={styles.selectedTrack}
      markerStyle={styles.marker}
      sliderLength={width - 32}
      containerStyle={styles.sliderContent}
      {...props}
    />
  </View>
);

MultiSlider.propTypes = {
  ...Slider.propTypes,
  label: PropTypes.string.isRequired,
};

export default MultiSlider;
