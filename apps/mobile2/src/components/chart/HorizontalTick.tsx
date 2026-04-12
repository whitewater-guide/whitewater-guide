import { Line as SkLine } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

const TICK_LENGTH = 4;

interface HorizontalTickProps {
  /** Y pixel position within the Skia canvas. */
  y: number;
  /** Color for this tick (binding-derived or default axis color). */
  color: string;
  /** Left edge of the chart plot area — tick is drawn just inside it. */
  chartBounds: { left: number };
}

/**
 * Renders a short horizontal tick mark at the left edge of the chart plot area.
 * Drawn inside chartBounds (left → left + TICK_LENGTH) so it is not clipped by
 * CartesianChart's Skia Group clip rect.
 */
export function HorizontalTick({ y, color, chartBounds }: HorizontalTickProps) {
  return (
    <SkLine
      p1={{ x: chartBounds.left, y }}
      p2={{ x: chartBounds.left + TICK_LENGTH, y }}
      color={color}
      strokeWidth={StyleSheet.hairlineWidth}
    />
  );
}
