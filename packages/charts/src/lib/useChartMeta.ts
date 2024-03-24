import { Unit } from '@whitewater-guide/schema';
import type { ScaleLinear, ScaleTime } from 'd3';
import { interpolateRound, scaleLinear, scaleTime } from 'd3';
import subDays from 'date-fns/subDays';
import { utcToZonedTime } from 'date-fns-tz';
import compact from 'lodash/compact';
import filterFn from 'lodash/filter';
import isFinite from 'lodash/isFinite';
import { useMemo, useRef } from 'react';

import type { ChartMetaSettings, ChartViewProps } from './types';

export interface ChartMeta {
  domain: {
    x: [Date, Date];
    y: [number, number];
  };
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  xTickValues: Date[];
  yTickValues: number[];
}

function useChartMeta(
  props: ChartViewProps,
  settings?: ChartMetaSettings,
): ChartMeta {
  // Treat settings as immutable
  const settingsRef = useRef(settings);

  return useMemo(() => {
    const { data, filter, unit, section, width, height, gauge, padding } =
      props;
    const { left = 0, right = 0, top = 0, bottom = 0 } = padding ?? {};
    const { timezone } = gauge;
    const {
      yDeltaRatio = 8,
      yTicks = 5,
      xTicks = 10,
    } = settingsRef.current || {};

    // Find min and max flow/level value
    let yRange = data.reduce(
      ([min, max], { [unit]: value }: any) => [
        Math.min(value, min),
        Math.max(value, max),
      ],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
    let ticks: number[] = [];
    const binding =
      section && (unit === Unit.LEVEL ? section.levels : section.flows);
    // Make sure that bindings fit within yRange
    if (binding) {
      const { minimum, maximum, optimum, impossible } = binding;
      yRange = [
        Math.min.apply(
          null,
          filterFn([yRange[0], minimum, maximum, optimum], isFinite),
        ),
        Math.max.apply(
          null,
          filterFn([yRange[1], minimum, maximum, optimum], isFinite),
        ),
      ];
      ticks = compact([minimum, maximum, optimum, impossible]);
    }

    const yDelta = (yDeltaRatio * (yRange[1] - yRange[0])) / height;
    let yDomain: [number, number] = [yRange[0] - yDelta, yRange[1] + yDelta];
    if (yDomain[0] === yDomain[1]) {
      if (yDomain[0] === 0) {
        yDomain = [-5, 5];
      } else {
        yDomain = [yDomain[0] * 0.9, yDomain[1] * 1.1];
      }
    }
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height - top - bottom, top])
      .nice()
      .interpolate(interpolateRound);
    const yTickValues = ticks.concat(yScale.ticks(yTicks));

    const toDate = filter.to ? new Date(filter.to) : new Date();
    const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
    const xDomain: [Date, Date] = [fromDate, toDate];
    // Currently xDomain is in UTC, we want to convert it to gauge's timezone
    if (timezone) {
      xDomain[0] = utcToZonedTime(xDomain[0], timezone);
      xDomain[1] = utcToZonedTime(xDomain[1], timezone);
    }
    const xScale = scaleTime()
      .domain(xDomain)
      .nice()
      .range([left, width - left - right])
      .interpolate(interpolateRound);
    const xTickValues = xScale.ticks(xTicks);

    return {
      domain: {
        x: xDomain,
        y: yDomain,
      },
      xScale,
      xTickValues,
      yScale,
      yTickValues,
    };
  }, [props, settingsRef]);
}

export default useChartMeta;
