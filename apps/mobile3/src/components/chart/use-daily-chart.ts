import { useMemo } from 'react';

import { differenceInDays, subDays } from './date';
import type { MeasurementsFilter } from './types';

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
    const onChangeDays = (nextDays: number) =>
      onChangeFilter({ from: subDays(nowDate, nextDays).toISOString(), to: now });
    return { days, onChangeDays };
  }, [filter, onChangeFilter]);
}
