import type { FC } from 'react';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import theme from '~/theme';

const HEIGHT = 40;
const WIDTH = (theme.screenWidth - 2 * theme.margin.single) / 6;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
  },
});

interface HalfMonthProps {
  currentValue: SharedValue<number[]>;
  index: number;
}

type HalfMonthComponent = FC<HalfMonthProps> & {
  height: number;
  width: number;
};

const HalfMonth: HalfMonthComponent = Object.assign(
  memo<HalfMonthProps>((props) => {
    const { currentValue } = props;
    const index = useSharedValue(props.index);

    const style = useAnimatedStyle(() => {
      const selected = currentValue.value.includes(index.value);
      return {
        backgroundColor: selected ? theme.colors.accent : 'transparent',
      };
    });

    return <Animated.View style={[styles.container, style]} />;
  }),
  { height: HEIGHT, width: WIDTH },
);

HalfMonth.displayName = 'HalfMonth';

export default HalfMonth;
