import { Unit } from '@whitewater-guide/schema';

import type { ChartDataPoint } from '../types';

export type VChartPoint = { ts: number; value: number } & Record<
  string,
  unknown
>;

export function computeChartData(
  data: ChartDataPoint[],
  unit: Unit,
): VChartPoint[] {
  const unitKey = unit as 'flow' | 'level';
  return data
    .filter((d) => d[unitKey] != null)
    .map((d) => ({ ts: d.timestamp.getTime(), value: d[unitKey] as number }));
}
