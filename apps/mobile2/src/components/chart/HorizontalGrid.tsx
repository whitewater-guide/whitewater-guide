import { Line as SkLine } from '@shopify/react-native-skia';
import type { SkFont } from '@shopify/react-native-skia';
import { Text as SkText } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';

interface HorizontalGridProps {
  /** Y pixel position within the Skia canvas. */
  y: number;
  /** Color for this line (binding-derived or default grid color). */
  color: string;
  /** Optional binding label: 'min', 'opt', 'max', 'imp'. */
  label?: string;
  /** Left/right bounds of the chart plot area. */
  chartBounds: { left: number; right: number };
  /** Skia font for the label — if null the label is not rendered. */
  font: SkFont | null;
}

/**
 * Renders a single horizontal grid line at a given y pixel position,
 * optionally with a binding-level label (min/opt/max) just above the line
 * on the right edge of the chart.
 * Used inside CartesianChart's children render prop.
 */
export function HorizontalGrid({
  y,
  color,
  label,
  chartBounds,
  font,
}: HorizontalGridProps) {
  return (
    <>
      <SkLine
        p1={{ x: chartBounds.left, y }}
        p2={{ x: chartBounds.right, y }}
        color={color}
        strokeWidth={StyleSheet.hairlineWidth}
      />
      {label && font && (
        <SkText
          x={chartBounds.right - 2}
          y={y - 2}
          text={label}
          font={font}
          color={color}
        />
      )}
    </>
  );
}
