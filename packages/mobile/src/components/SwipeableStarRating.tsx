import type { FC } from 'react';
import React, { useState } from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { AnimateProps } from 'react-native-reanimated';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from 'react-native-reanimated';

import theme from '~/theme';

import SimpleStarRating from './SimpleStarRating';

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
    height: 30,
    fontSize: 30,
    color: theme.colors.primary,
  },
  none: {
    height: 30,
    fontSize: 30,
    color: theme.colors.componentBorder,
  },
});

interface SwipeableStarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  style?: AnimateProps<ViewProps>['style'];
}

const SwipeableStarRating: FC<SwipeableStarRatingProps> = ({
  value,
  onChange = () => {},
  style,
}) => {
  const [stars, setStars] = useState(value);
  const temp = useSharedValue(0); // value in-progress of gesture
  const width = useSharedValue(0);
  const animatedRef = useAnimatedRef();

  useAnimatedReaction(
    () => temp.value,
    (next, prev) => {
      if (next !== prev) {
        runOnJS(setStars)(next);
      }
    },
  );

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      width.value = measurement.width;
    })
    .onUpdate((e) => {
      temp.value = positionToValue(e.x, width.value);
    })
    .onEnd(() => {
      runOnJS(onChange)(temp.value);
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      width.value = measurement.width;
    })
    .onTouchesDown((e) => {
      temp.value = positionToValue(e.allTouches[0].x, width.value);
    })
    .onEnd(() => {
      runOnJS(onChange)(temp.value);
    });

  const composed = Gesture.Race(dragGesture, tapGesture);

  return (
    <Animated.View ref={animatedRef} style={style}>
      <GestureDetector gesture={composed}>
        <SimpleStarRating
          value={stars}
          style={stars ? styles.stars : styles.none}
        />
      </GestureDetector>
    </Animated.View>
  );
};

export default SwipeableStarRating;
