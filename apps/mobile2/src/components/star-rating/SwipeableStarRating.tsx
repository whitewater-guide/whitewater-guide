import { noop } from 'lodash';
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

import theme from '../../theme';
import { STAR_STRINGS } from './common';
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

const styles = StyleSheet.create({
  stars: {
    fontFamily: 'MaterialDesignIcons',
    fontSize: 30,
    includeFontPadding: false,
  },
});

interface SwipeableStarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  style?: ViewProps['style'];
}

export function SwipeableStarRating(props: SwipeableStarRatingProps) {
  const { value, onChange = noop, style } = props;
  const stars = useSharedValue(value);
  const width = useSharedValue(0);
  const animatedRef = useAnimatedRef();

  const text = useDerivedValue(() => {
    return STAR_STRINGS.get(stars.value ?? 0);
  });

  const animatedProps = useAnimatedProps(() => {
    return { text: text.value, defaultValue: text.value };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      color:
        stars.value === null
          ? theme.colors.componentBorder
          : theme.colors.primary,
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
          scheduleOnRN(onChange, stars.value);
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
            style={[styles.stars, animatedStyle]}
            editable={false}
            pointerEvents="none"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
