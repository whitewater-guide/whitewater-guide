import { Unit } from '@whitewater-guide/commons';
import { scaleLinear, scaleTime } from 'd3-scale';
import differenceInDays from 'date-fns/differenceInDays';
import subDays from 'date-fns/subDays';
import compact from 'lodash/compact';
import filterFn from 'lodash/filter';
import isFinite from 'lodash/isFinite';
import { formatDate } from '../../../i18n';
import { getDefaultTimeAxisSettings } from './defaults';
import { ChartMeta, ChartMetaSettings, ChartViewProps } from './types';

export const computeChartMeta = (
  props: ChartViewProps,
  settings?: ChartMetaSettings,
): ChartMeta => {
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

  const yDelta = (yDeltaRatio * (result[1] - result[0])) / height!;
  const yDomain: [number, number] = [result[0] - yDelta, result[1] + yDelta];
  const yTickValues = ticks.concat(
    scaleLinear()
      .domain(yDomain)
      .ticks(yTicks),
  );

  const to = filter.to || new Date();
  const from = filter.from || subDays(to, 1);
  const xDomain: [Date, Date] = [from, to];

  const days = differenceInDays(from, to);
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
};
