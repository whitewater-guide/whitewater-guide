import { Measurement, Unit, Section, Gauge } from '@whitewater-guide/commons';
import { LevelInput } from '@whitewater-guide/logbook-schema';
import { useEffect } from 'react';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import sortBy from 'lodash/sortBy';

interface Props {
  data: Array<Measurement<Date>>;
  unit: Unit;
  gauge: Gauge;
  onLoaded: (value?: LevelInput) => void;
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
    const value = sorted.shift();
    if (!value) {
      onLoaded();
    } else {
      onLoaded({
        value: value[unit]!,
        unit: unit === Unit.FLOW ? gauge.flowUnit : gauge.levelUnit,
      });
    }
  }, [data, unit, startedAt, gauge, onLoaded]);
