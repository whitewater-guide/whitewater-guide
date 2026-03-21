import type { HorizontalLabelProps } from '@whitewater-guide/clients';
import React from 'react';
import { Text } from 'react-native-svg';

export const HorizontalLabel: React.FC<HorizontalLabelProps> = React.memo(
  (props) => {
    const { x, y = 0, textAnchor, datum, style, color } = props;
    return (
      <Text {...style} fill={color} x={x} y={y + 3} textAnchor={textAnchor}>
        {datum}
      </Text>
    );
  },
);

HorizontalLabel.displayName = 'HorizontalLabel';
