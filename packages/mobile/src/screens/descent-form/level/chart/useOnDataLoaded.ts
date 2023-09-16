import type { ChartDataPoint } from '@whitewater-guide/clients';
import type {
  DescentLevelInput,
  GaugeCoreFragment,
} from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import sortBy from 'lodash/sortBy';
import { useEffect } from 'react';

interface Props {
  data: ChartDataPoint[];
  unit: Unit;
  gauge: GaugeCoreFragment;
  onLoaded: (value?: DescentLevelInput) => void;
  startedAt: Date;
}

export default ({ data, unit, startedAt, onLoaded, gauge }: Props) =>
  useEffect(() => {
    if (!data || !data.length) {
      return;
    }
    // sort data by closest to startedAt
    const sorted = sortBy(data, (m) => {
      if (m[unit] === null) {
        return Number.POSITIVE_INFINITY;
      }
      return Math.abs(differenceInMilliseconds(m.timestamp, startedAt));
    });
    const value = sorted.shift()?.[unit];
    if (typeof value !== 'number') {
      onLoaded();
    } else {
      onLoaded({
        value,
        unit: unit === Unit.FLOW ? gauge.flowUnit : gauge.levelUnit,
      });
    }
  }, [data, unit, startedAt, gauge, onLoaded]);
