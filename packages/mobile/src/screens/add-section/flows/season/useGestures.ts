import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useSharedValue } from 'react-native-reanimated';

import HalfMonth from './HalfMonth';
import Month from './Month';

const COLS_IN_ROW = 6;

interface Offset {
  x: number;
  y: number;
}

function offsetToRow({ y }: Offset): number {
  'worklet';
  return Math.floor(y / Month.height);
}

function offsetToCol({ x }: Offset): number {
  'worklet';
  return Math.floor(x / HalfMonth.width);
}

function offsetToIndex(o: Offset): number {
  'worklet';
  return offsetToRow(o) * COLS_IN_ROW + offsetToCol(o);
}

function clamp(value: number): number {
  'worklet';
  return Math.min(23, Math.max(0, value));
}

function union(value: number[], range: number[]): number[] {
  'worklet';
  const result = [...value];
  if (range.length) {
    for (let i = range[0]; i <= range[1]; i += 1) {
      if (result.indexOf(i) === -1) {
        result.push(i);
      }
    }
  }
  return result.sort((a, b) => a - b);
}

function toggle(values: number[], value: number): number[] {
  'worklet';
  let index = 0;
  let found = false;

  for (index = 0; index < values.length; index++) {
    const v = values[index];
    if (v >= value) {
      found = v === value;
      break;
    }
  }

  const result = [...values];
  if (found) {
    result.splice(index, 1);
  } else {
    result.splice(index, 0, value);
  }

  return result;
}

export default function useGestures(
  initialValue: number[],
  onChange: (value: number[]) => void,
): [ReturnType<typeof Gesture.Race>, SharedValue<number[]>] {
  const currentValue = useSharedValue(initialValue);
  const startValue = useSharedValue<number[]>([]);
  const start = useSharedValue({ x: 0, y: 0 });
  const end = useSharedValue({ x: 0, y: 0 });

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onStart((e) => {
        'worklet';
        end.value = { x: e.x, y: e.y };
        start.value = { x: e.x, y: e.y };
        startValue.value = [...currentValue.value];
      })
      .onUpdate((e) => {
        'worklet';
        end.value = { x: e.x, y: e.y };
        const range = [
          clamp(Math.min(offsetToIndex(start.value), offsetToIndex(end.value))),
          clamp(Math.max(offsetToIndex(start.value), offsetToIndex(end.value))),
        ];
        currentValue.value = union(startValue.value, range);
      })
      .onEnd(() => {
        'worklet';
        runOnJS(onChange)(currentValue.value);
      });

    const tap = Gesture.Tap().onEnd((e) => {
      'worklet';
      currentValue.value = toggle(currentValue.value, offsetToIndex(e));
      runOnJS(onChange)(currentValue.value);
    });

    return Gesture.Race(pan, tap);
  }, [onChange]);

  return [gesture, currentValue];
}
