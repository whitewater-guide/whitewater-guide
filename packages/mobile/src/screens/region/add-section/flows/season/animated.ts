import { useMemo } from 'react';
import { State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import HalfMonth from './HalfMonth';
import Month from './Month';
import { AnimatedPoint } from './types';

const {
  add,
  block,
  call,
  cond,
  diffClamp,
  divide,
  eq,
  event,
  floor,
  max,
  min,
  multiply,
  onChange,
  or,
  set,
} = Animated;

const COLS_IN_ROW = 6;

const row = (node: Animated.Node<number>) => floor(divide(node, Month.height));
const col = (node: Animated.Node<number>) =>
  floor(divide(node, HalfMonth.width));

const ind = ({ x, y }: AnimatedPoint) =>
  add(multiply(row(y), COLS_IN_ROW), col(x));

const createGestureHandler = (
  start: AnimatedPoint,
  end: AnimatedPoint,
  onPan: (range: [number, number]) => void,
  onPanEnd: () => void,
) =>
  event([
    {
      nativeEvent: ({ x, y, state }: any) =>
        block([
          set(end.x, x),
          set(end.y, y),
          cond(eq(state, State.BEGAN), [set(start.x, x), set(start.y, y)]),
          onChange(
            ind(end),
            call(
              [
                diffClamp(min(ind(start), ind(end)), 0, 23),
                diffClamp(max(ind(start), ind(end)), 0, 23),
              ],
              onPan,
            ),
          ),
          onChange(
            state,
            cond(
              or(
                eq(state, State.END),
                eq(state, State.CANCELLED),
                eq(state, State.FAILED),
              ),
              call([], onPanEnd),
            ),
          ),
        ]),
    },
  ]);

export const usePanState = (
  onPan: (range: [number, number]) => void,
  onPanEnd: () => void,
) => {
  const values = useMemo(() => {
    const start = {
      x: new Animated.Value<number>(0),
      y: new Animated.Value<number>(0),
    };
    const end = {
      x: new Animated.Value<number>(0),
      y: new Animated.Value<number>(0),
    };
    const startInd = ind(start);
    const endInd = ind(end);
    return {
      start,
      end,
      startInd,
      endInd,
    };
  }, []);
  return useMemo(
    () => createGestureHandler(values.start, values.end, onPan, onPanEnd),
    [values, onPan, onPanEnd],
  );
};
