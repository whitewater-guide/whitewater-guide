import { Unit } from '@whitewater-guide/schema';
import { scaleLinear } from 'd3-scale';
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates
import subDays from 'date-fns/subDays';
import compact from 'lodash/compact';
import filterFn from 'lodash/filter';
import isFinite from 'lodash/isFinite';
import { useMemo, useRef } from 'react';

import { ChartMetaSettings, ChartViewProps, DomainMeta } from './types';

function useChartMeta(
  props: ChartViewProps,
  settings?: ChartMetaSettings,
): DomainMeta {
  // Treat settings as immutable
  const settingsRef = useRef(settings);
  return useMemo(() => {
    const { data, filter, unit, section, height } = props;
    const { yDeltaRatio = 8, yTicks = 5 } = settingsRef.current || {};
    let result = data.reduce(
      ([min, max], { [unit]: value }: any) => [
        Math.min(value, min),
        Math.max(value, max),
      ],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
    let ticks: number[] = [];
    const binding =
      section && (unit === Unit.LEVEL ? section.levels : section.flows);
    if (binding) {
      const { minimum, maximum, optimum, impossible } = binding;
      result = [
        Math.min.apply(
          null,
          filterFn([result[0], minimum, maximum, optimum], isFinite),
        ),
        Math.max.apply(
          null,
          filterFn([result[1], minimum, maximum, optimum], isFinite),
        ),
      ];
      ticks = compact([minimum, maximum, optimum, impossible]);
    }

    const yDelta = (yDeltaRatio * (result[1] - result[0])) / height;
    const yDomain: [number, number] = [result[0] - yDelta, result[1] + yDelta];
    const yTickValues = ticks.concat(
      scaleLinear().domain(yDomain).ticks(yTicks),
    );

    const toDate = filter.to ? new Date(filter.to) : new Date();
    const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
    const xDomain: [Date, Date] = [fromDate, toDate];

    return {
      domain: {
        x: xDomain,
        y: yDomain,
      },
      yTickValues,
    };
  }, [props, settingsRef]);
}

export default useChartMeta;
