import { DashPathEffect, Line as SkLine } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

interface HorizontalGridProps {
  /** Y pixel position within the Skia canvas. */
  y: number;
  /** Color for this line (binding-derived or default grid color). */
  color: string;
  /** Left/right bounds of the chart plot area. */
  chartBounds: { left: number; right: number };
  /**
   * Whether it's binding (min/opt/max) or calculated tick value
   */
  isBinding?: boolean;
}

/**
 * Renders a single horizontal grid line at a given y pixel position.
 * Binding-level lines (min/opt/max/imp) are drawn dashed; others solid.
 * Labels are rendered outside CartesianChart's clip region as RN Text views
 * in ChartComponent, so this component handles lines only.
 */
export function HorizontalGrid({
  y,
  color,
  chartBounds,
  isBinding,
}: HorizontalGridProps) {
  return (
    <SkLine
      p1={{ x: chartBounds.left, y }}
      p2={{ x: chartBounds.right, y }}
      color={color}
      strokeWidth={isBinding ? 1 : StyleSheet.hairlineWidth}
    >
      <DashPathEffect intervals={isBinding ? [10, 5] : [6, 6]} />
    </SkLine>
  );
}
