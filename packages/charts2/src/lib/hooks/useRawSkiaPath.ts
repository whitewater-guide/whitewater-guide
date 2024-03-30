import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import type { Unit } from '@whitewater-guide/schema';
import { useMemo } from 'react';

import { dataToCanvas } from '../math';
import type { CanvasDimensions, ChartDataPoint } from '../types';

export function useRawSkiaPath(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): SkPath {
  return useMemo(() => {
    let path = Skia.Path.Make();
    const { points } = dataToCanvas(data, unit, canvasParams);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      path = i ? path.lineTo(x, y) : path.moveTo(x, y);
    }
    return path;
  }, [data, unit, canvasParams]);
}
