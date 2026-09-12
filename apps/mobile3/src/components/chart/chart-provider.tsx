import { Unit } from '@whitewater-guide/schema';
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { subDays } from './date';
import type {
  ChartContextValue,
  ChartProps,
  MeasurementsFilter,
} from './types';
import { useChartMeasurements } from './use-chart-measurements';

const ChartCtx = createContext<ChartContextValue | null>(null);

export interface ChartProviderProps extends ChartProps {
  initialFilter?: MeasurementsFilter;
  children: ReactNode;
}

export function ChartProvider({
  gauge,
  section,
  initialFilter,
  children,
}: ChartProviderProps) {
  const [filter, onChangeFilter] = useState<MeasurementsFilter>(
    initialFilter || {
      from: subDays(new Date(), 1).toISOString(),
    },
  );
  const [unit, onChangeUnit] = useState(
    gauge.flowUnit ? Unit.FLOW : Unit.LEVEL,
  );
  const unitChangeable = useMemo(
    () => !!gauge.flowUnit && !!gauge.levelUnit,
    [gauge],
  );
  const measurements = useChartMeasurements(filter, gauge, section);
  const value = useMemo(
    () => ({
      measurements,
      filter,
      onChangeFilter,
      unit,
      unitChangeable,
      onChangeUnit,
      gauge,
      section,
    }),
    [
      measurements,
      filter,
      unit,
      unitChangeable,
      gauge,
      section,
    ],
  );

  return <ChartCtx.Provider value={value}>{children}</ChartCtx.Provider>;
}

export function useChart(): ChartContextValue {
  const ctx = useContext(ChartCtx);
  if (!ctx) {
    throw new Error('useChart must be used inside ChartProvider');
  }
  return ctx;
}
