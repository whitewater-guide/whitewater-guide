import { MeasurementsFilter } from '@whitewater-guide/schema';
// eslint-disable-next-line import/no-duplicates
import differenceInDays from 'date-fns/differenceInDays';
// eslint-disable-next-line import/no-duplicates
import subDays from 'date-fns/subDays';
import { useMemo } from 'react';

export interface UseDailyChart {
  days: number;
  onChangeDays: (days: number) => void;
}

export function useDailyChart(
  filter: MeasurementsFilter,
  onChangeFilter: (value: MeasurementsFilter) => void,
): UseDailyChart {
  return useMemo(() => {
    const nowDate = new Date();
    const now = nowDate.toISOString();
    const to = filter.to || now;
    const toDate = new Date(to);
    const from = filter.from || subDays(toDate, 1).toISOString();
    const fromDate = new Date(from);
    const days = differenceInDays(toDate, fromDate);
    const onChangeDays = (dayz: number) =>
      onChangeFilter({ from: subDays(nowDate, dayz).toISOString(), to: now });
    return { days, onChangeDays };
  }, [filter, onChangeFilter]);
}
