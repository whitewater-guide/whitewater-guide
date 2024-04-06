import { Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import type { ChartData } from '../math';
import { getXTicks } from '../math';

export function useXTicks(data: ChartData) {
  const xTicks = useMemo(() => getXTicks(data), [data]);

  return useMemo(() => {
    const { minVal, maxVal, scaleY } = data;
    const minY = scaleY(minVal);
    const maxY = scaleY(maxVal);
    return xTicks.map(({ minZoom, maxZoom, ticks }) => {
      let xGrid = Skia.Path.Make();
      ticks.forEach(({ x }) => {
        xGrid.moveTo(x, minY).lineTo(x, maxY);
      });
      return { minZoom, maxZoom, xGrid };
    });
  }, [data, xTicks]);
}
