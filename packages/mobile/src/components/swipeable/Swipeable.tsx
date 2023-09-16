import type { FC, ReactElement } from 'react';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { PanGestureHandler, RectButton } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { snapPoint as snap } from 'react-native-redash';

import { SPRING_CONFIG } from './constants';
import { useSwipeableList } from './SwipeableListProvider';

const ACTIVE_OFFSET_X = [-15, 0];
const ACTIVE_OFFSET_Y = [-500, 500];
const FAIL_OFFSET_Y = [-15, 15];

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { AnimatedProps, SharedValue } from 'react-native-reanimated';

export interface SwipeableProps {
  id: string;
  snapPoint: number;
  style?: AnimatedProps<ViewProps>['style'];
  renderOverlay: (position: SharedValue<number>) => ReactElement;
  overlayStyle?: StyleProp<ViewStyle>;
  renderUnderlay: (position: SharedValue<number>) => ReactElement;
  underlayStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Swipeable: FC<SwipeableProps> = (props) => {
  const {
    id,
    style,
    renderOverlay,
    overlayStyle,
    renderUnderlay,
    underlayStyle,
    snapPoint,
    onPress,
  } = props;

  const position = useSharedValue(0);
  const start = useSharedValue(0);
  const panRef = useRef<PanGestureHandler>(null);
  const [shouldRenderUnderlay, setShouldRenderUnderlay] = useState(false);

  const [selected, _close, listRef] = useSwipeableList();

  // Close item when selection changes
  useAnimatedReaction(
    () => {
      return id === selected?.value;
    },
    (isSelected, wasSelected) => {
      if (!isSelected && wasSelected) {
        position.value = withSpring(0, SPRING_CONFIG);
        runOnJS(setShouldRenderUnderlay)(false);
      }
    },
    [id],
  );

  const eventHandler = useAnimatedGestureHandler({
    onStart: () => {
      start.value = position.value;
      runOnJS(setShouldRenderUnderlay)(true);
    },
    onActive: (e) => {
      position.value = start.value + e.translationX;
    },
    onEnd: (e) => {
      const dest = snap(start.value + e.translationX, e.velocityX, [
        snapPoint,
        0,
      ]);
      position.value = withSpring(dest, SPRING_CONFIG);
      // Set list's currently selected item (or set empty selection)
      if (selected) {
        selected.value = dest === snapPoint ? id : '';
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateX: Math.min(position.value, 0) }],
  }));

  return (
    <PanGestureHandler
      ref={panRef}
      activeOffsetX={ACTIVE_OFFSET_X}
      activeOffsetY={ACTIVE_OFFSET_Y}
      failOffsetY={FAIL_OFFSET_Y}
      onGestureEvent={eventHandler}
      simultaneousHandlers={listRef}
    >
      <Animated.View style={style}>
        <View style={underlayStyle}>
          {shouldRenderUnderlay && renderUnderlay(position)}
        </View>

        <Animated.View style={animatedStyle}>
          {/* Rect button doesn't support border styles on Android, so wrap a view */}
          <RectButton onPress={onPress} waitFor={panRef}>
            <View style={overlayStyle}>{renderOverlay(position)}</View>
          </RectButton>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};
