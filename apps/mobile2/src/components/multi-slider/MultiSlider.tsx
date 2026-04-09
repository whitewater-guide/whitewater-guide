import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import RangeSlider from './RangeSlider';
import type { RangeSliderProps } from './types';

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

function MultiSlider({ label, ...props }: Props) {
  return (
    <View style={styles.sliderWrapper}>
      <Text variant="titleSmall" style={styles.label}>
        {label}
      </Text>
      <RangeSlider {...props} />
    </View>
  );
}

export default MultiSlider;
