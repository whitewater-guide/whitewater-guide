import { Line, vec } from '@shopify/react-native-skia';
import React, { FC } from 'react';

import { ChartMeta } from './useChartMeta';
import XTicks from './XTicks';

type XAxisProps = ChartMeta;

const XAxis: FC<XAxisProps> = (props) => {
  const { xScale, yScale } = props;
  return (
    <>
      <Line
        p1={vec(xScale(xScale.domain()[0]), yScale(0))}
        p2={vec(xScale(xScale.domain()[1]), yScale(0))}
        color="lightgrey"
        style="stroke"
        strokeWidth={1}
      />
      <XTicks {...props} />
    </>
  );
};

export default XAxis;
