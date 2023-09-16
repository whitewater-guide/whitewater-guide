import type { Gauge } from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import utcFormat from 'date-fns/format';
import { format } from 'date-fns-tz';

import type { ChartDataPoint } from './types';

export function formatChartHoverLabel(
  datum: ChartDataPoint | null,
  unit: Unit,
  gauge: Pick<Gauge, 'levelUnit' | 'flowUnit' | 'timezone'>,
): [string, string] {
  if (!datum) {
    return ['', ''];
  }
  const ts = datum.timestamp;
  const { levelUnit, flowUnit, timezone } = gauge;
  const val = datum[unit];
  const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;
  const timeStr = timezone
    ? format(ts, 'PPpp zzz', { timeZone: timezone })
    : utcFormat(ts, 'PPpp zzz');
  return [`${val} ${unitName}`, timeStr];
}
