import { HorizontalTickProps } from '@whitewater-guide/clients';
import React from 'react';
import { Line } from 'react-native-svg';

export const HorizontalTick: React.FC<HorizontalTickProps> = React.memo(
  (props) => {
    const { style, color, ...rest } = props;
    return <Line {...style} stroke={color} {...rest} />;
  },
);

HorizontalTick.displayName = 'HorizontalTick';
