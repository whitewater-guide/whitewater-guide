import { useValue } from '@shopify/react-native-skia';
import { useCallback } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

import { getYforX } from './math';
import usePanGesture from './usePanGesture';

export default function useHoverPosition() {
  const circleX = useValue(0);
  const circleY = useValue(0);

  const { gesture, isActive, x } = usePanGesture({
    enabled: true,
    holdDuration: 300,
  });

  const setFingerX = useCallback(
    (fingerX: number) => {
      const lowerBound = horizontalPadding;
      const upperBound = drawingWidth + horizontalPadding;

      const fingerXInRange = Math.min(
        Math.max(fingerX, lowerBound),
        upperBound,
      );
      const y = getYforX(commands.current, fingerXInRange);

      if (y != null) {
        circleY.current = y;
        circleX.current = fingerXInRange;
      }

      if (isActive.value) pathEnd.current = fingerXInRange / width;

      const actualFingerX = fingerX - horizontalPadding;

      const index = Math.round(
        (actualFingerX / drawingWidth) * (points.length - 1),
      );
      const pointIndex = Math.min(Math.max(index, 0), points.length - 1);

      if (pointSelectedIndex.current !== pointIndex) {
        const dataPoint = points[pointIndex];
        pointSelectedIndex.current = pointIndex;

        if (dataPoint != null) {
          onPointSelected?.(dataPoint);
        }
      }
    },
    [
      circleX,
      circleY,
      drawingWidth,
      horizontalPadding,
      isActive.value,
      onPointSelected,
      pathEnd,
      points,
      width,
    ],
  );

  useAnimatedReaction(
    () => x.value,
    (fingerX) => {
      if (isActive.value || fingerX) {
        runOnJS(setFingerX)(fingerX);
      }
    },
    [isActive, setFingerX, width, x],
  );
}
