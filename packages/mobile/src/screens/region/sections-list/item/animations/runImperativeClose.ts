import Animated, { EasingNode } from 'react-native-reanimated';

const {
  Clock,
  Value,
  block,
  clockRunning,
  cond,
  set,
  startClock,
  stopClock,
  timing,
} = Animated;

const runImperativeClose = (
  transY: Animated.Value<number>,
  imperativeFlag: Animated.Value<number>,
) => {
  const clock = new Clock();

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, transY),
      set(state.frameTime, 0),
      startClock(clock),
    ]),
    timing(clock, state, {
      duration: 300,
      easing: EasingNode.in(EasingNode.ease),
      toValue: 0,
    }),
    cond(state.finished, [stopClock(clock), set(imperativeFlag, 0)]),
    set(transY, state.position),
    transY,
  ]);
};

export default runImperativeClose;
