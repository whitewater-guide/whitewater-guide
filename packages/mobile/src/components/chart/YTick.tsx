import { getColorForValue } from '@whitewater-guide/clients';
import { GaugeBinding } from '@whitewater-guide/commons';
import React from 'react';
import { CommonPathProps, Line } from 'react-native-svg';
import theme from '../../theme';

interface YTickProps {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: CommonPathProps;
  binding?: GaugeBinding | null;
}

const YTick: React.FC<YTickProps> = (props) => {
  const { x1, x2, y1, y2, style, datum = 0, binding } = props;
  const defaultColor =
    style && style.stroke ? style.stroke.toString() : theme.colors.textMain;
  const lineStyle = {
    ...style,
    stroke: getColorForValue(datum, binding, defaultColor),
  };
  return <Line {...lineStyle} x1={x1} x2={x2} y1={y1} y2={y2} />;
};

export default YTick;
