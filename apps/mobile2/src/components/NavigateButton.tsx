import type { PointCoreFragment } from '@whitewater-guide/schema';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import theme from '../theme';
import { openGoogleMaps } from '../utils/maps';
import Icon from './Icon';

export const NAVIGATE_BUTTON_HEIGHT = 72;
export const NAVIGATE_BUTTON_WIDTH = 64;

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMain,
  },
});

interface Props {
  label: string;
  point?: PointCoreFragment | null;
  scaleValue: SharedValue<number>;
  scaleInput: [number, number];
  scaleOutput: [number, number];
}

function NavigateButton({ label, point, scaleValue, scaleInput, scaleOutput }: Props) {
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
      Extrapolate.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return (
    <Pressable onPress={point ? onPress : undefined} style={styles.button}>
      <Animated.View style={[styles.wrapper, scaleStyle]}>
        <Icon icon="car" size={28} />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default memo(NavigateButton);
