import { Line as SkLine } from '@shopify/react-native-skia';
import isSunday from 'date-fns/isSunday';
import React from 'react';
import { StyleSheet } from 'react-native';

import { CHART_COLORS } from './VictoryTheme';

interface TimeGridProps {
  /** Day-boundary dates with their computed x pixel positions inside the chart. */
  separators: Array<{ date: Date; xPixel: number }>;
  /** Top/bottom bounds of the chart plot area (from CartesianChart children). */
  chartBounds: { top: number; bottom: number };
  /** Number of days in the current time window (from filter). */
  days: number;
}

/**
 * Renders vertical day-separator lines in the Skia canvas.
 * For ≥30-day periods only Sundays receive a separator line.
 * Used inside CartesianChart's children render prop.
 */
export function TimeGrid({ separators, chartBounds, days }: TimeGridProps) {
  return (
    <>
      {separators.map(({ date, xPixel }) => {
        if (days >= 30 && !isSunday(date)) {
          return null;
        }
        return (
          <SkLine
            key={xPixel}
            p1={{ x: xPixel, y: chartBounds.top }}
            p2={{ x: xPixel, y: chartBounds.bottom }}
            color={CHART_COLORS.daySeparator}
            strokeWidth={StyleSheet.hairlineWidth}
          />
        );
      })}
    </>
  );
}
