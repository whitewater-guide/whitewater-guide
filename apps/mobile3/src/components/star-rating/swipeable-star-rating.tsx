import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { STAR_STRINGS } from './common';

import { useTheme } from '@/hooks/use-theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function positionToValue(x: number, width: number): number {
  'worklet';
  if (x <= 0) {
    return 0;
  }
  if (x >= width) {
    return 5;
  }
  return Math.round((10 * x) / width) * 0.5;
}

function noop(_value: number): void {}

export interface SwipeableStarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  style?: ViewProps['style'];
}

export function SwipeableStarRating(props: SwipeableStarRatingProps) {
  const { value, onChange = noop, style } = props;
  const theme = useTheme();
  const stars = useSharedValue(value);
  const width = useSharedValue(0);
  const animatedRef = useAnimatedRef();
  const fontFamily = MaterialCommunityIcons.getFontFamily();

  const text = useDerivedValue(() => {
    return STAR_STRINGS.get(stars.value ?? 0);
  });

  const animatedProps = useAnimatedProps(() => {
    return { text: text.value, defaultValue: text.value };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: stars.value === null ? theme.textSecondary : theme.primary,
    };
  });

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .averageTouches(true)
        .shouldCancelWhenOutside(false)
        .onBegin((e) => {
          const measurement = measure(animatedRef);
          if (measurement === null) {
            return;
          }
          width.value = measurement.width;
          stars.value = positionToValue(e.x, width.value);
        })
        .onUpdate((e) => {
          stars.value = positionToValue(e.x, width.value);
        })
        .onEnd(() => {
          scheduleOnRN(onChange, stars.value ?? 0);
        }),
    [stars, width, animatedRef, onChange],
  );

  return (
    <View style={style}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={animatedRef}
          pointerEvents="box-only"
          style={{ alignSelf: 'flex-start' }}
        >
          <AnimatedTextInput
            animatedProps={animatedProps}
            style={[styles.stars, { fontFamily }, animatedStyle]}
            editable={false}
            pointerEvents="none"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    fontSize: 30,
    includeFontPadding: false,
  },
});
