import { scaleTime } from 'd3-scale';
// eslint-disable-next-line import/no-duplicates
import differenceInDays from 'date-fns/differenceInDays';
// eslint-disable-next-line import/no-duplicates
import { useMemo, useRef } from 'react';

import { formatDate } from '../../../i18n';
import { getDefaultTimeAxisSettings } from './defaults';
import type { ChartMetaSettings, ChartViewProps, XMeta } from './types';

function useXMeta(
  xDomain: [Date, Date],
  { highlightedDate }: ChartViewProps,
  settings?: ChartMetaSettings,
): XMeta {
  // Treat settings as immutable
  const settingsRef = useRef(settings);
  return useMemo(() => {
    const { timeAxisSettings } = settingsRef.current || {};

    const days = differenceInDays(xDomain[1], xDomain[0]);
    const xAxisSettings = timeAxisSettings || getDefaultTimeAxisSettings(days);

    const xTickFormat = (date: Date, index: number, ticks: Date[]) => {
      const tickFormat =
        typeof xAxisSettings.tickFormat === 'string'
          ? xAxisSettings.tickFormat
          : xAxisSettings.tickFormat(date, index, ticks);
      return formatDate(date, tickFormat);
    };

    const xTickValues = scaleTime()
      .domain(xDomain)
      .ticks(xAxisSettings.tickCount);
    if (highlightedDate) {
      xTickValues.push(highlightedDate);
    }

    return {
      days,
      xTickValues,
      xTickFormat,
    };
  }, [xDomain, highlightedDate, settingsRef]);
}

export default useXMeta;
