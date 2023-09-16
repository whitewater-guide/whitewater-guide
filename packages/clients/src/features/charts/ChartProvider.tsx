import type { MeasurementsFilter } from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import subDays from 'date-fns/subDays';
import React, { useContext, useMemo, useState } from 'react';

import type { ChartContext, ChartProps, WithChartData } from './types';
import { useChartMeasurements } from './useChartMeasurements';

const ChartCtx = React.createContext<ChartContext & WithChartData>({} as any);

interface Props extends ChartProps {
  initialFilter?: MeasurementsFilter;
  children: React.ReactElement;
}

export const ChartProvider = React.memo<Props>((props) => {
  const { gauge, section, initialFilter, children } = props;
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
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    measurements,
    filter,
    onChangeFilter,
    unit,
    unitChangeable,
    onChangeUnit,
    gauge,
    section,
  };

  return (
    <ChartCtx.Provider value={value}>
      {React.Children.only(children)}
    </ChartCtx.Provider>
  );
});

ChartProvider.displayName = 'ChartProvider';

export const useChart = () => useContext(ChartCtx);
