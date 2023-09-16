import type {
  ChartDataPoint,
  ExtendedTooltipProps,
} from '@whitewater-guide/clients';
import { formatChartHoverLabel } from '@whitewater-guide/clients';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import type { VictoryTooltipProps } from 'victory';

const TEXT_STYLE: CSSProperties = {
  fill: '#111',
};

const LINE_STYLE: CSSProperties = {
  strokeDasharray: '10px, 5px',
  pointerEvents: 'none',
  opacity: 0.5,
  stroke: '#111',
};

const Crosshair: FC<VictoryTooltipProps & ExtendedTooltipProps> = (props) => {
  const { x, y, width, height, active, unit, gauge } = props;
  const datum = props.datum as ChartDataPoint;

  if (!active) {
    return null;
  }

  const [valueLabel, timeLabel] = formatChartHoverLabel(datum, unit, gauge);

  // I've tried to colorize crosshair and label accroding to hovered value. But it's not very readable.
  return (
    <g style={{ width: '100%', height: '100%' }}>
      <line style={LINE_STYLE} x1={0} x2={width} y1={y} y2={y} />
      <line style={LINE_STYLE} x1={x} x2={x} y1={0} y2={height} />

      <text
        y={65}
        x={width! / 2}
        dy={-5}
        textAnchor="middle"
        style={TEXT_STYLE}
      >
        {valueLabel}
      </text>
      <text
        y={77}
        x={width! / 2}
        dy={-5}
        textAnchor="middle"
        style={TEXT_STYLE}
      >
        {timeLabel}
      </text>
    </g>
  );
};

export default Crosshair;
