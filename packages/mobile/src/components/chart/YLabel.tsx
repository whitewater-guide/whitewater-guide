import { getColorForValue } from '@whitewater-guide/clients';
import { GaugeBinding } from '@whitewater-guide/commons';
import React from 'react';
import { Text, TextAnchor, TextSpecificProps } from 'react-native-svg';
import theme from '../../theme';

interface YLabelProps {
  x?: number;
  y?: number;
  textAnchor?: TextAnchor;
  datum?: number;
  style?: TextSpecificProps;
  binding?: GaugeBinding | null;
}

const YLabel: React.FC<YLabelProps> = (props) => {
  const { x, y = 0, textAnchor, binding, datum = 0, style } = props;
  const defaultColor =
    style && style.fill ? style.fill.toString() : theme.colors.textMain;
  const textStyle = {
    ...style,
    fill: getColorForValue(datum, binding, defaultColor),
  };
  return (
    <Text {...textStyle} x={x} y={y + 3} textAnchor={textAnchor}>
      {datum}
    </Text>
  );
};

export default YLabel;
