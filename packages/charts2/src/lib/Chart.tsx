/* eslint-disable react/style-prop-object */
import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import type { FC } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import { GestureHandler } from './GestureHandler';
import { useCanvasData, useRawSkiaPath, useXTicks } from './hooks';
import type { ChartViewProps } from './types';

const Chart: FC<ChartViewProps> = (props) => {
  const { data, unit, ...canvasParams } = props;
  const { width, height } = canvasParams;
  const canvasData = useCanvasData(data, unit, canvasParams);
  const rawPath = useRawSkiaPath(canvasData);
  const rawXGrid = useXTicks(canvasData);
  const matrix = useSharedValue(Skia.Matrix());

  const path = useDerivedValue(() => {
    return rawPath.copy().transform(matrix.value);
  }, [matrix, rawPath]);

  const xGrid = useDerivedValue(() => {
    const zoom = matrix.value.get()[0];
    const { xGrid } = rawXGrid[0];
    return xGrid.copy().transform(matrix.value);
  }, [matrix, rawXGrid]);

  return (
    <GestureHandler
      matrix={matrix}
      width={width}
      height={height}
      padding={canvasData.padding}
    >
      <Canvas style={{ width, height }}>
        <Group>
          <Path style="stroke" path={xGrid} strokeWidth={1} color="#999" />
          <Path style="stroke" path={path} strokeWidth={2}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, height)}
              colors={['blue', 'yellow']}
            />
          </Path>
        </Group>
      </Canvas>
    </GestureHandler>
  );
};

export default Chart;
