import { MeasurementsFilter } from '@whitewater-guide/commons';
import { useMemo } from 'react';
import subDays from 'date-fns/subDays';
import differenceInDays from 'date-fns/differenceInDays';

export function useDailyChart(
  filter: MeasurementsFilter<Date>,
  onChangeFilter: (value: MeasurementsFilter<Date>) => void,
) {
  return useMemo(() => {
    const now = new Date();
    const to = filter.to || now;
    const from = filter.from || subDays(to, 1);
    const days = differenceInDays(from, to);
    const onChangeDays = (dayz: number) =>
      onChangeFilter({ from: subDays(now, dayz), to: now });
    return { days, onChangeDays };
  }, [filter, onChangeFilter]);
}
