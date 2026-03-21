import type { HorizontalTickProps } from '@whitewater-guide/clients';
import React from 'react';
import { LineSegment } from 'victory';

const HorizontalTick = React.memo<HorizontalTickProps>((props) => {
  const { style, color, ...rest } = props;
  return <LineSegment {...rest} style={{ ...style, stroke: color }} />;
});

HorizontalTick.displayName = 'HorizontalTick';

export default HorizontalTick;
