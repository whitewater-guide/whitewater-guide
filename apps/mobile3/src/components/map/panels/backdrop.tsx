import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

function Backdrop({ animatedIndex }: BottomSheetBackdropProps) {
  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 0.5],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[styles.backdrop, opacity]} pointerEvents="none" />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
});

export default memo(Backdrop);
