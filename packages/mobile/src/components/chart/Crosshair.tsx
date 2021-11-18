import {
  ChartDataPoint,
  ExtendedTooltipProps,
  formatChartHoverLabel,
} from '@whitewater-guide/clients';
import React, { FC } from 'react';
import { G, Line, Text } from 'react-native-svg';
import { VictoryTooltipProps } from 'victory';

export const Crosshair: FC<VictoryTooltipProps & ExtendedTooltipProps> = (
  props,
) => {
  const { x, y, width, height, active, unit, gauge } = props;
  const datum = props.datum as ChartDataPoint;

  if (!active) {
    return null;
  }

  const [valueLabel, timeLabel] = formatChartHoverLabel(datum, unit, gauge);

  // I've tried to colorize crosshair and label accroding to hovered value. But it's not very readable.
  return (
    <G pointerEvents="none">
      <Line
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        stroke="#111"
        strokeDasharray={[10, 5]}
        opacity={0.5}
      />
      <Line
        x1={x}
        x2={x}
        y1={52}
        y2={height}
        stroke="#111"
        strokeDasharray={[10, 5]}
        opacity={0.5}
      />

      <Text y={35} x={width! / 2} textAnchor="middle" fill="#111">
        {valueLabel}
      </Text>
      <Text y={47} x={width! / 2} textAnchor="middle" fill="#111">
        {timeLabel}
      </Text>
    </G>
  );
};
