import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

export function computeDaySeparators(
  xDomain: [number, number],
): Array<{ date: Date; ts: number }> {
  const [fromMs, toMs] = xDomain;
  const result: Array<{ date: Date; ts: number }> = [];
  // Start at beginning of the first full day after fromMs
  let current = startOfDay(addDays(new Date(fromMs), 1));
  while (current.getTime() < toMs) {
    result.push({ date: new Date(current), ts: current.getTime() });
    current = addDays(current, 1);
  }
  return result;
}
