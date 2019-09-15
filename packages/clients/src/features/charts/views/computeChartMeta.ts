import { Unit } from '@whitewater-guide/commons';
import { scaleLinear } from 'd3-scale';
import subDays from 'date-fns/subDays';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import isFinite from 'lodash/isFinite';
import { formatDate } from '../../../i18n';
import { ChartMeta, ChartMetaSettings, ChartViewProps, Period } from './types';

const TimeAxisSettings = {
  [Period.DAY]: {
    tickFormat: 'HH:mm',
    tickCount: 6,
  },
  [Period.WEEK]: {
    tickFormat: 'EEE do',
    tickCount: 7,
  },
  [Period.MONTH]: {
    tickFormat: 'do MMM',
    tickCount: 31,
  },
};

export const computeChartMeta = (
  props: ChartViewProps,
  settings?: ChartMetaSettings,
): ChartMeta => {
  const { data, days, unit, section, width, height } = props;
  const { yDeltaRatio = 8, yTicks = 5 } = settings || {};
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
        filter([result[0], minimum, maximum, optimum], isFinite),
      ),
      Math.max.apply(
        null,
        filter([result[1], minimum, maximum, optimum], isFinite),
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

  // Cannot set _xDomain on chart explicitly, so workaround by adding data
  const xDomain: [Date, Date] = [subDays(new Date(), days), new Date()];

  let period = Period.DAY;
  if (days > 7) {
    period = Period.MONTH;
  } else if (days > 1) {
    period = Period.WEEK;
  }
  const timeAxisSettings = TimeAxisSettings[period];
  const xTickFormat = (date: Date) =>
    formatDate(date, timeAxisSettings.tickFormat);
  const xTickCount = timeAxisSettings.tickCount;
  return {
    period,
    domain: {
      x: xDomain,
      y: yDomain,
    },
    xTickCount,
    xTickFormat,
    yTickValues,
  };
};