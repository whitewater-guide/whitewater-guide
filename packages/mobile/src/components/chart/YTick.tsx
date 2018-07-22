import React from 'react';
import { CommonPathProps, Line } from 'react-native-svg';
import theme from '../../theme';
import { getColorForValue } from '../../ww-clients/features/sections';
import { GaugeBinding } from '../../ww-commons';

interface YTickProps {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  datum?: number;
  style?: CommonPathProps;
  binding: GaugeBinding;
}

const YTick: React.StatelessComponent<YTickProps> = (props) => {
  const { x1, x2, y1, y2, style, datum = 0, binding } = props;
  const defaultColor = (style && style.stroke) ? style.stroke : theme.colors.textMain;
  const lineStyle = { ...style, stroke: getColorForValue(datum, binding, defaultColor), };
  return (
    <Line {...lineStyle} x1={x1} x2={x2} y1={y1} y2={y2} />
  );
};

export default YTick;
