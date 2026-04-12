import type { MeasurementsFilter } from '@whitewater-guide/schema';
import differenceInDays from 'date-fns/differenceInDays';
import subDays from 'date-fns/subDays';

export function computeXDomain(filter: MeasurementsFilter): {
  xDomain: [number, number];
  days: number;
} {
  const now = new Date();
  const toDate = filter.to ? new Date(filter.to) : now;
  const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
  const days = Math.max(1, differenceInDays(toDate, fromDate));
  return { xDomain: [fromDate.getTime(), toDate.getTime()], days };
}
