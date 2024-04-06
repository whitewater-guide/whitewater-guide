import type { SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import type { ChartData } from '../math';

export function useRawSkiaPath(canvas: ChartData): SkPath {
  return useMemo(() => {
    let path = Skia.Path.Make();
    const { points } = canvas;
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      path = i ? path.lineTo(x, y) : path.moveTo(x, y);
    }
    return path;
  }, [canvas]);
}
