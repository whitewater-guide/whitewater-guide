import { getColorForValue } from '@whitewater-guide/clients';
import { GaugeBinding } from '@whitewater-guide/commons';
import React from 'react';
import { G, Line, LineProps, Text } from 'react-native-svg';
import theme from '../../theme';

interface Props {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: LineProps;
  binding?: GaugeBinding;
}

const HorizontalGridLine: React.FC<Props> = (props) => {
  const { x1 = 0, x2 = 0, y1 = 0, y2 = 0, datum = 0, binding, style } = props;
  const { minimum = 0, maximum = 0, optimum = 0 } = binding || {};
  const defaultColor =
    style && style.stroke ? style.stroke.toString() : theme.colors.textMain;
  const color = getColorForValue(datum, binding, defaultColor);
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
      {label && (
        <Text textAnchor="end" y={-4} x={x2 - x1} fill={color}>
          {label}
        </Text>
      )}
    </G>
  );
};

export default HorizontalGridLine;
