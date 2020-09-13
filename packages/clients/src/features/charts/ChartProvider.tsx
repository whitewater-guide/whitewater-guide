import { MeasurementsFilter, Unit } from '@whitewater-guide/commons';
import subDays from 'date-fns/subDays';
import React, { useContext, useMemo, useState } from 'react';

import { ChartContext, ChartProps, WithMeasurements } from './types';
import { useChartMeasurements } from './useChartMeasurements';

const ChartCtx = React.createContext<ChartContext & WithMeasurements>(
  {} as any,
);

interface Props extends ChartProps {
  initialFilter?: MeasurementsFilter<Date>;
}

export const ChartProvider: React.FC<Props> = React.memo((props) => {
  const { gauge, section, initialFilter, children } = props;
  const [filter, onChangeFilter] = useState<MeasurementsFilter<Date>>(
    initialFilter || {
      from: subDays(new Date(), 1),
    },
  );
  const [unit, onChangeUnit] = useState(
    gauge.flowUnit ? Unit.FLOW : Unit.LEVEL,
  );
  const unitChangeable = useMemo(() => !!gauge.flowUnit && !!gauge.levelUnit, [
    gauge,
  ]);

  const measurements = useChartMeasurements(filter, gauge, section);

  return (
    <ChartCtx.Provider
      value={{
        measurements,
        filter,
        onChangeFilter,
        unit,
        unitChangeable,
        onChangeUnit,
        gauge,
        section,
      }}
    >
      {children}
    </ChartCtx.Provider>
  );
});

ChartProvider.displayName = 'ChartProvider';

export const useChart = () => useContext(ChartCtx);
