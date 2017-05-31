import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-native-svg';
import { getColorForValue } from '../../commons/features/sections';

const YTick = (props) => {
  const { x1, x2, y1, y2, style, datum, binding } = props;
  const lineStyle = { ...style, stroke: getColorForValue(datum, binding, style.stroke) };
  return (
    <Line {...lineStyle} x1={x1} x2={x2} y1={y1} y2={y2} />
  );
};

YTick.propTypes = {
  x1: PropTypes.number,
  x2: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number,
  datum: PropTypes.number,
  style: PropTypes.object,
  binding: PropTypes.object,
};

// var a = {
//   binding: {
//     minimum: 13,
//     maximum: 50,
//     optimum: 25,
//     impossible: 200,
//     approximate: 0,
//     lastTimestamp: '2017-05-31T10:40:00.000Z',
//     lastValue: 10.038942
//   },
//   index: 8,
//   x1: 48,
//   y1: 22.297872340425556,
//   x2: 43,
//   y2: 22.297872340425556,
//   style: {
//     fill: 'transparent',
//     size: 5,
//     stroke: '#90A4AE',
//     strokeWidth: 1,
//     strokeLinecap: 'round',
//     strokeLinejoin: 'round'
//   },
//   datum: 50
// }

export default YTick;