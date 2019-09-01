import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import theme from '../../../../../theme';

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
}

type HalfMonth = React.FC<Props> & { height: number; width: number };

const HalfMonth: HalfMonth = Object.assign(
  React.memo((props: Props) => {
    const { index, onPress, selected } = props;
    const onClick = useCallback(() => onPress(index), [index, onPress]);
    return (
      <TouchableOpacity style={styles.touchable} onPress={onClick}>
        <View style={[styles.container, selected && styles.selected]} />
      </TouchableOpacity>
    );
  }),
  { height: HEIGHT, width: WIDTH },
);

HalfMonth.displayName = 'HalfMonth';

export default HalfMonth;
