import { HorizontalGridProps } from '@whitewater-guide/clients';
import React from 'react';
import { G, Line, Text } from 'react-native-svg';

export const HorizontalGrid: React.FC<HorizontalGridProps> = React.memo(
  (props) => {
    const { x1 = 0, x2 = 0, y1 = 0, label, style, color } = props;
    // pointerEvents is 'painted' by default and will break react-native
    const { pointerEvents: _, ...restStyle } = style;
    return (
      <G x={x1} y={y1}>
        <Line {...restStyle} stroke={color} x1={0} x2={x2 - x1} y1={0} y2={0} />
        {label && (
          <Text textAnchor="end" y={-4} x={x2 - x1} fill={color}>
            {label}
          </Text>
        )}
      </G>
    );
  },
);

HorizontalGrid.displayName = 'HorizontalGrid';
