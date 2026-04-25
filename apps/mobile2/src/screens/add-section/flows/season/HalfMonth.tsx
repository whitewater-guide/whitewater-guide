import { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import theme from '../../../../theme';

const { width: screenWidth } = Dimensions.get('window');

const HEIGHT = 40;
const WIDTH = (screenWidth - 2 * theme.margin.single) / 6;

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

interface HalfMonthStatics {
  height: number;
  width: number;
}

const HalfMonthBase = memo<HalfMonthProps>((props) => {
  const { currentValue } = props;
  const index = useSharedValue(props.index);

  const style = useAnimatedStyle(() => {
    const selected = currentValue.value.includes(index.value);
    return {
      backgroundColor: selected ? theme.colors.accent : 'transparent',
    };
  });

  return <Animated.View style={[styles.container, style]} />;
});

HalfMonthBase.displayName = 'HalfMonth';

const HalfMonth: typeof HalfMonthBase & HalfMonthStatics = Object.assign(
  HalfMonthBase,
  { height: HEIGHT, width: WIDTH },
);

export default HalfMonth;
