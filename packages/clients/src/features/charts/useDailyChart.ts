import { MeasurementsFilter } from '@whitewater-guide/commons';
import differenceInDays from 'date-fns/differenceInDays';
import subDays from 'date-fns/subDays';
import { useMemo } from 'react';

export function useDailyChart(
  filter: MeasurementsFilter<Date>,
  onChangeFilter: (value: MeasurementsFilter<Date>) => void,
) {
  return useMemo(() => {
    const now = new Date();
    const to = filter.to || now;
    const from = filter.from || subDays(to, 1);
    const days = differenceInDays(to, from);
    const onChangeDays = (dayz: number) =>
      onChangeFilter({ from: subDays(now, dayz), to: now });
    return { days, onChangeDays };
  }, [filter, onChangeFilter]);
}
