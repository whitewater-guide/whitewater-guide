import type { SkMatrix } from '@shopify/react-native-skia';
import { Path } from '@shopify/react-native-skia';
import type { FC } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';

import type { ChartData } from './math';

interface XGridProps {
  matrix: SharedValue<SkMatrix>;
  data: ChartData;
}

const XGrid: FC<XGridProps> = ({ matrix, data }) => {
  const { xTicks } = data;

  const path = useDerivedValue(() => {
    const zoom = matrix.value.get()[0];
    const { gridLines } = xTicks.find(
      ({ minZoom, maxZoom }) => zoom >= minZoom && zoom <= maxZoom,
    )!;
    return gridLines.copy().transform(matrix.value);
  }, [matrix, xTicks]);

  return <Path style="stroke" path={path} strokeWidth={1} color="#999" />;
};

export default XGrid;
