import Animated from 'react-native-reanimated';

import runDragWithSnap from './runDragWithSnap';
import runImperativeClose from './runImperativeClose';

const { Clock, Value, block, cond, stopClock } = Animated;

export const runAnimation = (snapPoint: number, onOpen: () => void) => {
  const inertiaClock = new Clock();
  const transY = new Value(0);
  const imperativeCloseFlag = new Value<number>(0);

  const drag = runDragWithSnap(transY, inertiaClock, snapPoint, onOpen);

  const runClose = block([
    stopClock(inertiaClock),
    runImperativeClose(transY, imperativeCloseFlag),
  ]);

  return {
    position: cond(imperativeCloseFlag, runClose, drag.run),
    gestureHandler: drag.eventHandler,
    watchOnOpen: drag.watchOnOpen,
    close: () => {
      imperativeCloseFlag.setValue(1);
    },
  };
};

export type SwipeableAnimation = ReturnType<typeof runAnimation>;
