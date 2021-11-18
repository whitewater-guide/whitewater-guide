import { Unit } from '@whitewater-guide/schema';
import utcFormat from 'date-fns/format';
import { format } from 'date-fns-tz';
import { useCallback } from 'react';

interface Datum {
  level: number | null;
  flow: number | null;
  timestamp: Date;
}

function useTooltipLabel(
  unit: Unit,
  levelUnit?: string | null,
  flowUnit?: string | null,
  timeZone?: string | null,
) {
  return useCallback(
    ({ datum }: { datum: Datum }) => {
      const ts = datum.timestamp;
      const val = datum[unit];
      const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;
      const timeStr = timeZone
        ? format(ts, 'Pp zzz', { timeZone })
        : utcFormat(ts, 'Pp zzz');
      return `${val} ${unitName}\n${timeStr}`;
    },
    [unit, levelUnit, flowUnit, timeZone],
  );
}

export default useTooltipLabel;
