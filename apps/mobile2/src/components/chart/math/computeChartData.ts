import type { ChartViewProps } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';

// Must satisfy Record<string, unknown> for CartesianChart generics
export type VChartPoint = { ts: number; value: number } & Record<
  string,
  unknown
>;

export function computeChartData(
  data: ChartViewProps['data'],
  unit: Unit,
): VChartPoint[] {
  const unitKey = unit as 'flow' | 'level';
  return data
    .filter((d) => d[unitKey] != null)
    .map((d) => ({ ts: d.timestamp.getTime(), value: d[unitKey] as number }));
}
