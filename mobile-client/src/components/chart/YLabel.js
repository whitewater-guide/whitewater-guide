import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native-svg';
import { getColorForValue } from '../../commons/features/sections';

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

const YLabel = (props) => {
  const { x, y, textAnchor, binding, datum, style } = props;
  const textStyle = { ...style, fill: getColorForValue(datum, binding, style.fill) };
  return (
    <Text {...textStyle} x={x} y={y - 7} textAnchor={textAnchor}>
      { datum }
    </Text>
  );
};

YLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  textAnchor: PropTypes.string,
  datum: PropTypes.number,
  style: PropTypes.object,
  binding: PropTypes.shape({
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    optimum: PropTypes.number,
    impossible: PropTypes.number,
    approximate: PropTypes.number,
  }),
};

export default YLabel;
