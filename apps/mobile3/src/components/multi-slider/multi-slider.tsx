import { StyleSheet, View } from 'react-native';

import RangeSlider from './range-slider';
import type { RangeSliderProps } from './types';

import { ThemedText } from '@/components/themed-text';

export interface MultiSliderProps extends RangeSliderProps {
  label: string;
}

export default function MultiSlider({ label, ...props }: MultiSliderProps) {
  return (
    <View style={styles.sliderWrapper}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>
      <RangeSlider {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: -10,
  },
  label: {
    paddingHorizontal: 10,
  },
});
