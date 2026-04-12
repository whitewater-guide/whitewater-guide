import type { SkFont } from '@shopify/react-native-skia';
import { Text as SkText } from '@shopify/react-native-skia';
import React from 'react';

interface HorizontalLabelProps {
  /** Y pixel position within the Skia canvas. */
  y: number;
  /** Numeric data value to display. */
  value: number;
  /** Color for this label (binding-derived or default label color). */
  color: string;
  /** Left edge of the chart plot area — label is right-aligned just before it. */
  chartBounds: { left: number };
  /** Skia font — if null the label is not rendered. */
  font: SkFont | null;
}

/**
 * Renders a right-aligned y-axis label to the left of the chart plot area.
 * Used inside CartesianChart's children render prop alongside HorizontalTick.
 */
export function HorizontalLabel({
  y,
  value,
  color,
  chartBounds,
  font,
}: HorizontalLabelProps) {
  if (!font) {
    return null;
  }
  const text = String(parseFloat(value.toFixed(2)));
  const textWidth = font.measureText(text).width;
  return (
    <SkText
      x={chartBounds.left - 6 - textWidth}
      y={y + 3}
      text={text}
      font={font}
      color={color}
    />
  );
}
