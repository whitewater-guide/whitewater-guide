import { Skia, type SkMatrix, vec } from '@shopify/react-native-skia';
import type { FC, PropsWithChildren } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

import { scale, translate } from './math';

interface GestureHandlerProps {
  matrix: SharedValue<SkMatrix>;
  width: number;
  height: number;
}

export const GestureHandler: FC<PropsWithChildren<GestureHandlerProps>> = (
  props,
) => {
  const { matrix, width, height, children } = props;
  const pivot = useSharedValue(Skia.Point(0, 0));
  const offset = useSharedValue(Skia.Matrix());

  // const pan = Gesture.Pan().onChange((event) => {
  //   matrix.value = translate(matrix.value, event.changeX, event.changeY);
  // });

  const pan = Gesture.Pan().onChange((event) => {
    const currentMatrix = matrix.value.get();
    const currentS = currentMatrix[0];
    const currentTx = currentMatrix[2];
    const currentTy = currentMatrix[5];
    // console.log({ currentMatrix });

    const dataW = width * currentS;
    const dataH = height * currentS;

    // Calculate the maximum allowed translation to keep the chart within the screen
    const maxTx = Math.max(0, dataW - width);
    const maxTy = Math.max(0, dataH - height);

    // Calculate the new translation values, applying constraints
    let newTx = currentTx + event.changeX;
    let newTy = currentTy + event.changeY;

    // Apply constraints to ensure the chart does not move out of the screen
    newTx = Math.min(0, Math.max(-maxTx, newTx));
    newTy = Math.min(0, Math.max(-maxTy, newTy));

    // Update the matrix with the constrained translation values
    matrix.value = translate(
      matrix.value,
      newTx - currentTx,
      newTy - currentTy,
    );
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
