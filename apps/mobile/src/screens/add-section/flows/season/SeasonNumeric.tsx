import times from 'lodash/times';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import HalfMonth from './HalfMonth';
import Month from './Month';
import useGestures from './useGestures';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

interface SeasonNumericProps {
  value: number[];
  onChange: (value: number[]) => void;
  testID?: string;
}

const SeasonNumeric: React.FC<SeasonNumericProps> = React.memo((props) => {
  const { value, onChange, testID } = props;
  const [gestures, currentValue] = useGestures(value, onChange);

  return (
    <GestureDetector gesture={gestures}>
      <View style={styles.container} testID={testID} collapsable={false}>
        {times(12).map((i) => (
          <Month index={i} key={i}>
            <HalfMonth index={i * 2} currentValue={currentValue} />
            <HalfMonth index={i * 2 + 1} currentValue={currentValue} />
          </Month>
        ))}
      </View>
    </GestureDetector>
  );
});

SeasonNumeric.displayName = 'SeasonNumeric';

export default SeasonNumeric;
