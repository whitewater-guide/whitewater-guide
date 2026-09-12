import { Line as SkLine } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

const TICK_LENGTH = 4;

export interface HorizontalTickProps {
  y: number;
  color: string;
  chartBounds: { left: number };
}

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
