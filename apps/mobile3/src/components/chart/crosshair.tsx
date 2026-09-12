import type { SkFont } from '@shopify/react-native-skia';
import { Line as SkLine, Text as SkText } from '@shopify/react-native-skia';
import { Unit } from '@whitewater-guide/schema';
import type { SharedValue } from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';

import { CHART_COLORS } from './chart-colors';
import type { GaugeForChart } from './types';

export interface ChartBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface CrosshairProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  xValue: SharedValue<number>;
  yValue: SharedValue<number>;
  chartBounds: ChartBounds;
  unit: Unit;
  gauge: Pick<GaugeForChart, 'flowUnit' | 'levelUnit' | 'timezone'>;
  font: SkFont | null;
}

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

  const vTop = useDerivedValue(() => ({ x: x.value, y: top }));
  const vBot = useDerivedValue(() => ({ x: x.value, y: bottom }));
  const hLeft = useDerivedValue(() => ({ x: left, y: y.value }));
  const hRight = useDerivedValue(() => ({ x: right, y: y.value }));

  const unitName =
    unit === Unit.FLOW ? (gauge.flowUnit ?? '') : (gauge.levelUnit ?? '');
  const valueLabel = useDerivedValue(
    () => `${yValue.value.toFixed(2)} ${unitName}`,
  );
  const timeLabel = useDerivedValue(() => {
    const d = new Date(xValue.value);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    return `${hh}:${mm}  ${dd}/${mo}`;
  });

  return (
    <>
      <SkLine
        p1={vTop}
        p2={vBot}
        color={CHART_COLORS.crosshair}
        strokeWidth={1}
        opacity={0.5}
      />
      <SkLine
        p1={hLeft}
        p2={hRight}
        color={CHART_COLORS.crosshair}
        strokeWidth={1}
        opacity={0.5}
      />
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
