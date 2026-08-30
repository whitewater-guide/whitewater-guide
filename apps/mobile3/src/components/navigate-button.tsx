import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { useTheme } from '@/hooks/use-theme';
import type { Coordinates } from '@/types/coordinates';
import { openGoogleMaps } from '@/utils/maps';

export const NAVIGATE_BUTTON_HEIGHT = 72;
export const NAVIGATE_BUTTON_WIDTH = 64;

export interface NavigatePoint {
  id: string;
  coordinates: Coordinates;
  kind: string;
  name?: string | null;
}

export interface NavigateButtonProps {
  label: string;
  point?: NavigatePoint | null;
  scaleValue: SharedValue<number>;
  scaleInput: [number, number];
  scaleOutput: [number, number];
}

function NavigateButton({
  label,
  point,
  scaleValue,
  scaleInput,
  scaleOutput,
}: NavigateButtonProps) {
  const theme = useTheme();

  const onPress = useCallback(() => {
    if (point) {
      openGoogleMaps(point.coordinates, point.name).catch(() => {
        // ignore
      });
    }
  }, [point]);

  const scaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scaleValue.value,
      scaleInput,
      scaleOutput,
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return (
    <Pressable
      onPress={point ? onPress : undefined}
      style={[styles.button, { backgroundColor: theme.primary }]}
    >
      <Animated.View style={[styles.wrapper, scaleStyle]}>
        <Icon icon="car" size={28} color="#ffffff" />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default memo(NavigateButton);
