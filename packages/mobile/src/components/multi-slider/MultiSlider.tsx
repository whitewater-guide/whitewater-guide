import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { RangeSlider, RangeSliderProps } from './RangeSlider';

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: -10,
  },
  label: {
    paddingHorizontal: 10,
  },
});

interface Props extends RangeSliderProps {
  label: string;
}

export const MultiSlider: React.SFC<Props> = ({ label, ...props }) => (
  <View style={styles.sliderWrapper}>
    <Subheading style={styles.label}>{label}</Subheading>
    <RangeSlider {...props} />
  </View>
);
