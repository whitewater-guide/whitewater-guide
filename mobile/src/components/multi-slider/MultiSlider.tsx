import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import { RangeSlider } from './RangeSlider';
import { RangeSliderProps } from './types';

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: -10,
  },
  label: {
    paddingHorizontal: 10,
  },
});

interface Props extends Partial<RangeSliderProps> {
  label: string;
}

export const MultiSlider: React.FC<Props> = ({ label, ...props }) => (
  <View style={styles.sliderWrapper}>
    <Subheading style={styles.label}>{label}</Subheading>
    <RangeSlider {...props} />
  </View>
);
