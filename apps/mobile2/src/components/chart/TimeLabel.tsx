import format from 'date-fns/format';

/**
 * Formats a numeric timestamp (ms since epoch) as an x-axis label.
 *
 * Rules:
 * - ≤1 day:  time only, e.g. "14:30"  (3 h ticks, all unique)
 * - ≤3 days: midnight → "9 Apr", noon → "12:00"  (12 h ticks, mixed)
 * - >3 days: date only, e.g. "9 Apr"  (daily or weekly ticks, all unique)
 *
 * Used as CartesianChart xAxis.formatXLabel callback.
 */
export function formatTimeLabel(timestampMs: number, days: number): string {
  const date = new Date(timestampMs);
  if (days <= 1) return format(date, 'HH:mm');
  if (days <= 3) {
    return date.getHours() === 0 ? format(date, 'd MMM') : format(date, 'HH:mm');
  }
  return format(date, 'd MMM');
}
