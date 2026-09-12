import { addDays, startOfDay } from '../date';

export interface DaySeparator {
  date: Date;
  ts: number;
}

export function computeDaySeparators(
  xDomain: [number, number],
): DaySeparator[] {
  const [fromMs, toMs] = xDomain;
  const result: DaySeparator[] = [];
  let current = startOfDay(addDays(new Date(fromMs), 1));
  while (current.getTime() < toMs) {
    result.push({ date: new Date(current), ts: current.getTime() });
    current = addDays(current, 1);
  }
  return result;
}
