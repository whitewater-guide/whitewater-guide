import format from 'date-fns/format';
import isSunday from 'date-fns/isSunday';

/**
 * Formats a numeric timestamp (ms since epoch) as an x-axis label.
 *
 * Rules ported from the legacy TimeLabel component:
 * - ≥14 days: only show labels on Sundays (returns '' for other dates)
 * - ≥3 days: day + short month, e.g. "12 Apr"
 * - <3 days: time only, e.g. "14:30"
 *
 * Used as CartesianChart xAxis.formatXLabel callback.
 */
export function formatTimeLabel(timestampMs: number, days: number): string {
  const date = new Date(timestampMs);
  if (days >= 14) {
    return isSunday(date) ? format(date, 'd MMM') : '';
  }
  if (days >= 3) {
    return format(date, 'd MMM');
  }
  return format(date, 'HH:mm');
}
