import { Skia, type SkMatrix, vec } from '@shopify/react-native-skia';
import type { FC, PropsWithChildren } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

import { scale, translate } from './math';

interface GestureHandlerProps {
  matrix: SharedValue<SkMatrix>;
}

export const GestureHandler: FC<PropsWithChildren<GestureHandlerProps>> = (
  props,
) => {
  const { matrix, children } = props;
  const pivot = useSharedValue(Skia.Point(0, 0));
  const offset = useSharedValue(Skia.Matrix());

  const pan = Gesture.Pan().onChange((event) => {
    matrix.value = translate(matrix.value, event.changeX, event.changeY);
  });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart((e) => {
      matrix.value = scale(matrix.value, 1.05, vec(e.x, e.y));
    });

  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      offset.value = matrix.value;
      pivot.value = vec(e.focalX, e.focalY);
    })
    .onChange((e) => {
      matrix.value = scale(offset.value, e.scale, pivot.value);
    });

  const gesture = Gesture.Race(doubleTap, pan, pinch);

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
};
