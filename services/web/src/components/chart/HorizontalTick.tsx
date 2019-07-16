import { HorizontalTickProps } from '@whitewater-guide/clients';
import React from 'react';
import { LineSegment } from 'victory';

const HorizontalTick: React.FC<HorizontalTickProps> = React.memo((props) => {
  const { style, color, ...rest } = props;
  return <LineSegment {...rest} style={{ ...style, stroke: color }} />;
});

HorizontalTick.displayName = 'HorizontalTick';

export default HorizontalTick;
