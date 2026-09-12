import { differenceInDays, subDays } from '../date';
import type { MeasurementsFilter } from '../types';

export interface XDomainResult {
  xDomain: [number, number];
  days: number;
}

export function computeXDomain(filter: MeasurementsFilter): XDomainResult {
  const now = new Date();
  const toDate = filter.to ? new Date(filter.to) : now;
  const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
  const days = Math.max(1, differenceInDays(toDate, fromDate));
  return { xDomain: [fromDate.getTime(), toDate.getTime()], days };
}
