import React from 'react';
import { Text, TextAnchor, TextSpecificProps } from 'react-native-svg';
import { getColorForValue } from '../../ww-clients/features/sections';
import { GaugeBinding } from '../../ww-commons';

interface YLabelProps {
  x?: number;
  y?: number;
  textAnchor?: TextAnchor;
  datum?: number;
  style?: TextSpecificProps;
  binding?: GaugeBinding;
}

const YLabel: React.StatelessComponent<YLabelProps> = (props) => {
  const { x, y, textAnchor, binding, datum, style } = props;
  const textStyle = { ...style, fill: getColorForValue(datum, binding, style.fill) };
  return (
    <Text {...textStyle} x={x} y={y + 3} textAnchor={textAnchor}>
      {datum}
    </Text>
  );
};

export default YLabel;
