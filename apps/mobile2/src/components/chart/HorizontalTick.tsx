import { Line as SkLine } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

const TICK_LENGTH = 4;

interface HorizontalTickProps {
  /** Y pixel position within the Skia canvas. */
  y: number;
  /** Color for this tick (binding-derived or default axis color). */
  color: string;
  /** Left edge of the chart plot area — tick is drawn just to the left of it. */
  chartBounds: { left: number };
}

/**
 * Renders a short horizontal tick mark at the left edge of the chart plot area.
 * Used inside CartesianChart's children render prop alongside HorizontalLabel.
 */
export function HorizontalTick({ y, color, chartBounds }: HorizontalTickProps) {
  return (
    <SkLine
      p1={{ x: chartBounds.left - TICK_LENGTH, y }}
      p2={{ x: chartBounds.left, y }}
      color={color}
      strokeWidth={StyleSheet.hairlineWidth}
    />
  );
}
