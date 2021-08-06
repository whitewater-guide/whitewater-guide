import { Unit } from '@whitewater-guide/schema';
import { scaleLinear, scaleTime } from 'd3-scale';
// eslint-disable-next-line import/no-duplicates
import differenceInDays from 'date-fns/differenceInDays';
// eslint-disable-next-line import/no-duplicates
import subDays from 'date-fns/subDays';
import compact from 'lodash/compact';
import filterFn from 'lodash/filter';
import isFinite from 'lodash/isFinite';

import { formatDate } from '../../../i18n';
import { getDefaultTimeAxisSettings } from './defaults';
import { ChartMeta, ChartMetaSettings, ChartViewProps } from './types';

export function computeChartMeta(
  props: ChartViewProps,
  settings?: ChartMetaSettings,
): ChartMeta {
  const { data, filter, unit, section, height, highlightedDate } = props;
  const { yDeltaRatio = 8, yTicks = 5, timeAxisSettings } = settings || {};
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
  const yTickValues = ticks.concat(scaleLinear().domain(yDomain).ticks(yTicks));

  const toDate = filter.to ? new Date(filter.to) : new Date();
  const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
  const xDomain: [Date, Date] = [fromDate, toDate];

  const days = differenceInDays(toDate, fromDate);
  const xAxisSettings = timeAxisSettings || getDefaultTimeAxisSettings(days);
  const xTickFormat = (date: Date) =>
    formatDate(date, xAxisSettings.tickFormat);
  const xTickValues = scaleTime()
    .domain(xDomain)
    .ticks(xAxisSettings.tickCount);
  if (highlightedDate) {
    xTickValues.push(highlightedDate);
  }

  return {
    days,
    domain: {
      x: xDomain,
      y: yDomain,
    },
    xTickValues,
    xTickFormat,
    yTickValues,
  };
}
