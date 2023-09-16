import type { PointCoreFragment } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useRegionPremiumCallback } from '~/features/purchases';
import theme from '~/theme';
import { openGoogleMaps } from '~/utils/maps';

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

export const NavigateButton = memo<Props>((props) => {
  const { label, point, scaleValue, scaleInput, scaleOutput } = props;

  const [onPress] = useRegionPremiumCallback(
    undefined,
    () => {
      if (point) {
        openGoogleMaps(point.coordinates, point.name).catch(() => {
          // do not care about error
        });
      }
    },
    point,
  );

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
    <RectButton onPress={onPress} style={styles.button}>
      <Animated.View style={[styles.wrapper, scaleStyle]}>
        <Icon icon="car" size={28} />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </RectButton>
  );
});

NavigateButton.displayName = 'NavigateButton';
