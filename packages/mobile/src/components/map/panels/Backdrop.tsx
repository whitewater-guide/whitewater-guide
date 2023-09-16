import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});

const Backdrop = memo<BottomSheetBackdropProps>(({ animatedIndex }) => {
  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[styles.backdrop, opacity]} pointerEvents="none" />
  );
});

Backdrop.displayName = 'Backdrop';

export default Backdrop;
