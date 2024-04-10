import type { Unit } from '@whitewater-guide/schema';

import type { CanvasDimensions, ChartDataPoint } from '../types';
import { getChartDataDimensions } from './getChartDataDimensions';
import { getXTicks } from './getXTicks';
import type { ChartData } from './types';

export function getChartData(
  data: ChartDataPoint[],
  unit: Unit,
  canvasParams: CanvasDimensions,
): ChartData {
  const dataDimensions = getChartDataDimensions(data, unit, canvasParams);
  const xTicks = getXTicks(dataDimensions);
  return {
    ...dataDimensions,
    xTicks,
  };
}
