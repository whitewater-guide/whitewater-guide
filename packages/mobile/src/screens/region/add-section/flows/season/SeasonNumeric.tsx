import times from 'lodash/times';
import xor from 'lodash/xor';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { usePanState } from './animated';
import HalfMonth from './HalfMonth';
import Month from './Month';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const union = (value: number[], range: number[]) => {
  const result = [...value];
  if (range.length) {
    for (let i = range[0]; i <= range[1]; i++) {
      if (result.indexOf(i) === -1) {
        result.push(i);
      }
    }
  }
  return result.sort((a, b) => a - b);
};

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
}

const SeasonNumeric: React.FC<Props> = React.memo((props) => {
  const { value, onChange } = props;
  const onToggle = useCallback(
    (index: number) => {
      onChange(xor(value, [index]).sort((a, b) => a - b));
    },
    [value, onChange],
  );

  const [panSelection, setPanSelection] = useState<number[]>([]);
  const panSelectionRef = useRef<number[]>(panSelection);
  const valueRef = useRef<number[]>(value);
  panSelectionRef.current = panSelection;
  valueRef.current = value;

  const selection = useMemo(() => union(value, panSelection), [
    value,
    panSelection,
  ]);

  const onPanEnd = useCallback(() => {
    onChange(union(valueRef.current, panSelectionRef.current));
    setPanSelection([]);
  }, [valueRef, panSelectionRef, onChange, setPanSelection]);

  const panGestureHandler = usePanState(setPanSelection, onPanEnd);

  return (
    <PanGestureHandler
      onGestureEvent={panGestureHandler}
      onHandlerStateChange={panGestureHandler}
    >
      <Animated.View style={styles.container}>
        {times(12).map((i) => (
          <Month index={i} key={i}>
            <HalfMonth
              index={i * 2}
              onPress={onToggle}
              selected={selection.includes(i * 2)}
            />
            <HalfMonth
              index={i * 2 + 1}
              onPress={onToggle}
              selected={selection.includes(i * 2 + 1)}
            />
          </Month>
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
});

SeasonNumeric.displayName = 'SeasonNumeric';

export default SeasonNumeric;
