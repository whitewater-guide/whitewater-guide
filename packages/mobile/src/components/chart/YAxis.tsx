import React from 'react';
import { G, Line, Text } from 'react-native-svg';

interface YAxisProps {
  x1?: number;
  y1?: number;
  y2?: number;
  style?: object;
  unitName?: string;
}

const YAxis: React.StatelessComponent<YAxisProps> = (props) => {
  const { x1, y1, y2, style, unitName } = props;
  return (
    <G x={x1} y={y1}>
      <Line {...style} x1={0} y1={0} x2={0} y2={y2 - y1} />
      <Text x={-12} y={-6} textAnchor="end">
        {unitName}
      </Text>
    </G>
  );
};

export default YAxis;
