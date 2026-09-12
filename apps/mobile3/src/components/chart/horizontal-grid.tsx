import { DashPathEffect, Line as SkLine } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

export interface HorizontalGridProps {
  y: number;
  color: string;
  chartBounds: { left: number; right: number };
  isBinding?: boolean;
}

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
