import React from 'react';
import PropTypes from 'prop-types';
import { G, Line, Text } from 'react-native-svg';
import { getColorForValue } from '../../commons/features/sections';

const HorizontalGridLine = (props) => {
  const { x1, x2, y1, y2, datum, binding } = props;
  const { pointerEvents, ...style } = props.style;
  const { minimum, maximum, optimum } = binding || {};
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
        <Text textAnchor="end" y={-14} x={x2 - x1} fill={color}>
          { label }
        </Text>
      }
    </G>
  );
};

// const sampleProps = {
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
//   x2: 344,
//   y2: 22.297872340425556,
//   style: {
//     fill: 'transparent',
//     stroke: '#ECEFF1',
//     strokeDasharray: '10, 5',
//     strokeLinecap: 'round',
//     strokeLinejoin: 'round',
//     pointerEvents: 'none'
//   },
//   datum: 50
// };


HorizontalGridLine.propTypes = {
  x1: PropTypes.number,
  x2: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number,
  datum: PropTypes.number,
  style: PropTypes.object,
  binding: PropTypes.object,
};

export default HorizontalGridLine;