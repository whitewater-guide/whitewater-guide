import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

import theme from '~/theme';

const HEIGHT = 40;
const WIDTH = (theme.screenWidth - 2 * theme.margin.single) / 6;

const styles = StyleSheet.create({
  touchable: {
    width: WIDTH,
    height: HEIGHT,
  },
  container: {
    width: WIDTH,
    height: HEIGHT,
  },
  hover: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
  },
  selected: {
    backgroundColor: theme.colors.accent,
  },
});

interface Props {
  index: number;
  onPress: (index: number) => void;
  selected: boolean;
  panHandlerRef: any;
}

type HalfMonthComponent = React.FC<Props> & { height: number; width: number };

const HalfMonth: HalfMonthComponent = Object.assign(
  // eslint-disable-next-line react/display-name
  React.memo((props: Props) => {
    const { index, onPress, selected, panHandlerRef } = props;
    const onTap = useCallback(
      (e) => {
        if (e.nativeEvent.state === State.END) {
          onPress(index);
        }
      },
      [index, onPress],
    );
    return (
      <TapGestureHandler
        simultaneousHandlers={panHandlerRef}
        onHandlerStateChange={onTap}
        maxDurationMs={200}
      >
        <View style={[styles.container, selected && styles.selected]} />
      </TapGestureHandler>
    );
  }),
  { height: HEIGHT, width: WIDTH },
);

HalfMonth.displayName = 'HalfMonth';

export default HalfMonth;
