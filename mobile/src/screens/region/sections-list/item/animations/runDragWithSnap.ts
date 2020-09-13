import { State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { snapPoint as getSnapPoint, spring } from 'react-native-redash';

const {
  Value,
  add,
  block,
  cond,
  eq,
  event,
  or,
  set,
  stopClock,
  call,
  lessOrEq,
  clockRunning,
  onChange,
} = Animated;

const runDragWithSnap = (
  transX: Animated.Value<number>,
  inertiaClock: Animated.Adaptable<any>,
  snapPoint: number,
  onOpen: () => void,
) => {
  const springConfig = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  const offset = new Value(0);

  const dragX = new Value(0);
  const state = new Value(-1);
  const dragVX = new Value(0);

  const eventHandler = event([
    { nativeEvent: { translationX: dragX, velocityX: dragVX, state } },
  ]);

  const run = block([
    cond(
      or(
        eq(state, State.END),
        eq(state, State.CANCELLED),
        eq(state, State.FAILED),
      ),
      [
        set(
          transX,
          spring({
            clock: inertiaClock,
            from: add(offset, dragX),
            to: getSnapPoint(add(offset, dragX), dragVX, [0, snapPoint]),
            config: springConfig,
          }),
        ),
      ],
      [
        stopClock(inertiaClock),
        cond(eq(state, State.BEGAN), [set(offset, transX)]),
        set(transX, add(offset, dragX)),
      ],
    ),
    transX,
  ]);

  const watchOnOpen = onChange(
    clockRunning(inertiaClock),
    cond(lessOrEq(transX, snapPoint), call([], onOpen)),
  );

  return {
    eventHandler,
    run,
    watchOnOpen,
  };
};

export default runDragWithSnap;
