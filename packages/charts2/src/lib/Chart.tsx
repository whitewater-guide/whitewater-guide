/* eslint-disable react/style-prop-object */
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import type { FC } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { GestureHandler } from './GestureHandler';
import { useRawSkiaPath } from './hooks';
import type { ChartViewProps } from './types';

const Chart: FC<ChartViewProps> = (props) => {
  const { data, unit, ...canvasParams } = props;
  const { width, height } = canvasParams;
  const rawPath = useRawSkiaPath(data, unit, canvasParams);
  const matrix = useSharedValue(Skia.Matrix());

  const path = useDerivedValue(() => {
    return rawPath.copy().transform(matrix.value);
  }, [matrix, rawPath]);

  return (
    <GestureHandler matrix={matrix}>
      <Canvas style={{ width, height }}>
        <Group>
          <Path style="stroke" path={path} strokeWidth={2} color="#6231ff" />
        </Group>
      </Canvas>
    </GestureHandler>
  );
};

export default Chart;
