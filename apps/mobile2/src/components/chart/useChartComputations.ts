import type { ChartViewProps } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import { useCallback, useMemo } from 'react';

import {
  computeChartData,
  computeDaySeparators,
  computeXDomain,
  computeYDomain,
} from './math';
import { formatTimeLabel } from './TimeLabel';

export function useChartComputations({
  data,
  unit,
  section,
  filter,
}: Pick<ChartViewProps, 'data' | 'unit' | 'section' | 'filter'>) {
  const binding =
    section && (unit === Unit.LEVEL ? section.levels : section.flows);

  const { yDomain, yTickValues } = useMemo(
    () => computeYDomain(data, unit, binding),
    [data, unit, binding],
  );

  const { xDomain, days } = useMemo(() => computeXDomain(filter), [filter]);

  const rawSeparators = useMemo(
    () => computeDaySeparators(xDomain),
    [xDomain],
  );

  const chartData = useMemo(() => computeChartData(data, unit), [data, unit]);

  const formatX = useCallback(
    (ts: number) => formatTimeLabel(ts, days),
    [days],
  );

  return { binding, yDomain, yTickValues, xDomain, days, rawSeparators, chartData, formatX };
}
