import { Unit } from '@whitewater-guide/schema';
import format from 'date-fns/format';
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
) {
  return useCallback(
    ({ datum }: { datum: Datum }) => {
      const ts = datum.timestamp;
      const val = datum[unit];
      const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;
      return `${val} ${unitName}\n${format(ts, 'Pp')}`;
    },
    [unit, levelUnit, flowUnit],
  );
}

export default useTooltipLabel;
