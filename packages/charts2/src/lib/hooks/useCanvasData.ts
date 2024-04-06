import type { Unit } from '@whitewater-guide/schema';
import { useMemo } from 'react';

import type { ChartData } from '../math';
import { dataToCanvas } from '../math';
import type { CanvasDimensions, ChartDataPoint } from '../types';

export function useCanvasData(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): ChartData {
  return useMemo(
    () => dataToCanvas(data, unit, canvasParams),
    [data, unit, canvasParams],
  );
}
