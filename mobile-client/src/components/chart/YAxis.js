import React from 'react';
import PropTypes from 'prop-types';
import { G, Line, Text } from 'react-native-svg';

const YAxis = (props) => {
  const { x1, y1, y2, style, unit } = props;
  return (
    <G x={x1} y={y1}>
      <Line {...style} x1={0} y1={0} x2={0} y2={y2 - y1} />
      <Text x={-12} y={-16} textAnchor="end">
        { unit }
      </Text>
    </G>
  );
};

// const sampleProps = {
//   index: 0,
//   style: {
//     fill: 'transparent',
//     stroke: '#90A4AE',
//     strokeWidth: 2,
//     strokeLinecap: 'round',
//     strokeLinejoin: 'round'
//   },
//   x1: 48,
//   x2: 48,
//   y1: 16,
//   y2: 312
// }

YAxis.propTypes = {
  x1: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number,
  style: PropTypes.object,
  unit: PropTypes.string,
};

export default YAxis;
