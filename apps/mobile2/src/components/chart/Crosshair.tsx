import type { SkFont } from '@shopify/react-native-skia';
import { Line as SkLine, Text as SkText } from '@shopify/react-native-skia';
import { formatChartHoverLabel } from '@whitewater-guide/clients';
import type { GaugeForChartFragment } from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';

import { CHART_COLORS } from './VictoryTheme';

interface ChartBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface CrosshairProps {
  /** Pixel x position of the active press (SharedValue from useChartPressState). */
  x: SharedValue<number>;
  /** Pixel y position of the active press. */
  y: SharedValue<number>;
  /** Data x value — timestamp in ms (SharedValue). */
  xValue: SharedValue<number>;
  /** Data y value — flow or level number (SharedValue). */
  yValue: SharedValue<number>;
  /** Chart plot area bounds. */
  chartBounds: ChartBounds;
  /** Currently displayed unit. */
  unit: Unit;
  /** Gauge metadata for unit names. */
  gauge: Pick<GaugeForChartFragment, 'flowUnit' | 'levelUnit' | 'timezone'>;
  /** Skia font for labels — if null text is not rendered. */
  font: SkFont | null;
}

/**
 * Interactive crosshair overlay rendered inside the CartesianChart Skia canvas.
 * Shows vertical + horizontal dashed lines through the active press point and
 * a value + timestamp label pair at the top of the chart area.
 *
 * All position values are Reanimated SharedValues so the crosshair updates on
 * the UI thread without a React re-render.
 */
export function Crosshair({
  x,
  y,
  xValue,
  yValue,
  chartBounds,
  unit,
  gauge,
  font,
}: CrosshairProps) {
  const { left, right, top, bottom } = chartBounds;
  const centerX = (left + right) / 2;

  // Derived Skia point objects for the two line segments
  const vTop = useDerivedValue(() => ({ x: x.value, y: top }));
  const vBot = useDerivedValue(() => ({ x: x.value, y: bottom }));
  const hLeft = useDerivedValue(() => ({ x: left, y: y.value }));
  const hRight = useDerivedValue(() => ({ x: right, y: y.value }));

  // Derived text from press values
  const unitName =
    unit === Unit.FLOW ? (gauge.flowUnit ?? '') : (gauge.levelUnit ?? '');
  const valueLabel = useDerivedValue(
    () => `${yValue.value.toFixed(2)} ${unitName}`,
  );
  const timeLabel = useDerivedValue(() => {
    const d = new Date(xValue.value);
    // worklet — use basic formatting without date-fns (no imports allowed in worklets)
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}  ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  });

  return (
    <>
      {/* Vertical crosshair line */}
      <SkLine
        p1={vTop}
        p2={vBot}
        color={CHART_COLORS.crosshair}
        strokeWidth={1}
        opacity={0.5}
      />
      {/* Horizontal crosshair line */}
      <SkLine
        p1={hLeft}
        p2={hRight}
        color={CHART_COLORS.crosshair}
        strokeWidth={1}
        opacity={0.5}
      />
      {/* Value + time labels */}
      {font && (
        <>
          <SkText
            x={centerX}
            y={top + 14}
            text={valueLabel}
            font={font}
            color={CHART_COLORS.crosshair}
          />
          <SkText
            x={centerX}
            y={top + 26}
            text={timeLabel}
            font={font}
            color={CHART_COLORS.crosshair}
          />
        </>
      )}
    </>
  );
}

// Re-export for convenience (stories import from here)
export { formatChartHoverLabel };
