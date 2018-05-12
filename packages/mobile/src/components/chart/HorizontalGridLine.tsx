import React from 'react';
import { G, Line, LineProps, Text } from 'react-native-svg';
import { getColorForValue } from '../../ww-clients/features/sections';
import { GaugeBinding } from '../../ww-commons/features/sections';

interface Props {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: LineProps;
  binding?: GaugeBinding;
}

const HorizontalGridLine: React.StatelessComponent<Props> = (props) => {
  const { x1, x2, y1, y2, datum, binding } = props;
  const { pointerEvents, ...style } = props.style;
  const { minimum = 0, maximum = 0, optimum = 0} = binding || {};
  const color = getColorForValue(datum, binding, style.stroke);
  const lineStyle = { ...style, stroke: color };
  let label;
  if (datum === minimum) {
    label = 'min';
  } else if (datum === optimum) {
    label = 'opt';
  } else if (datum === maximum) {
    label = 'max';
  }
  return (
    <G x={x1} y={y1}>
      <Line {...lineStyle} x1={0} x2={x2 - x1} y1={0} y2={0} />
      {
        label &&
        <Text textAnchor="end" y={-4} x={x2 - x1} fill={color}>
          {label}
        </Text>
      }
    </G>
  );
};

export default HorizontalGridLine;
