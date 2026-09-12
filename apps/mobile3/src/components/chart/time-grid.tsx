import { Line as SkLine } from '@shopify/react-native-skia';
import { Fragment } from 'react';
import { StyleSheet } from 'react-native';

import { CHART_COLORS } from './chart-colors';
import { isSunday } from './date';

export interface TimeGridSeparator {
  date: Date;
  xPixel: number;
}

export interface TimeGridProps {
  separators: TimeGridSeparator[];
  chartBounds: { top: number; bottom: number };
  days: number;
}

export function TimeGrid({ separators, chartBounds, days }: TimeGridProps) {
  return (
    <>
      {separators.map(({ date, xPixel }) => {
        if (days >= 30 && !isSunday(date)) {
          return null;
        }
        return (
          <Fragment key={xPixel}>
            <SkLine
              p1={{ x: xPixel, y: chartBounds.top }}
              p2={{ x: xPixel, y: chartBounds.bottom }}
              color={CHART_COLORS.daySeparator}
              strokeWidth={StyleSheet.hairlineWidth}
            />
          </Fragment>
        );
      })}
    </>
  );
}
