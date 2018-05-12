import React from 'react';
import { Text, TextAnchor, TextSpecificProps } from 'react-native-svg';
import { getColorForValue } from '../../ww-clients/features/sections';
import { GaugeBinding } from '../../ww-commons';

// const sampleProps = {
//   index: 8,
//   style: {
//     fontFamily: 'Roboto, Helvetica Neue, Helvetica, sans-serif',
//     fontSize: 12,
//     letterSpacing: 'normal',
//     padding: 8,
//     fill: '#455A64',
//     stroke: 'transparent',
//     strokeWidth: 0
//   },
//   x: 35,
//   y: 22.2978723404255,
//   verticalAnchor: 'middle',
//   textAnchor: 'end',
//   angle: undefined,
//   text: 50,
//   datum: 50
// };

interface YLabelProps {
  x: number;
  y: number;
  textAnchor: TextAnchor;
  datum: number;
  style: TextSpecificProps;
  binding: GaugeBinding;
}

const YLabel: React.StatelessComponent<YLabelProps> = (props) => {
  const { x, y, textAnchor, binding, datum, style } = props;
  const textStyle = { ...style, fill: getColorForValue(datum, binding, style.fill) };
  return (
    <Text {...textStyle} x={x} y={y - 7} textAnchor={textAnchor}>
      {datum}
    </Text>
  );
};

export default YLabel;
