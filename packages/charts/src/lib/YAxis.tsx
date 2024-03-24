import { Line, vec } from '@shopify/react-native-skia';
import React, { FC } from 'react';

import { ChartMeta } from './useChartMeta';
import YTicks from './YTicks';

interface YAxisProps extends ChartMeta {
  height: number;
}

const YAxis: FC<YAxisProps> = (props) => {
  const { xScale, yScale, height } = props;
  return (
    <>
      <Line
        p1={vec(xScale(xScale.domain()[0]), height - 45)}
        p2={vec(xScale(xScale.domain()[0]), yScale(yScale.domain()[1]))}
        color="lightgrey"
        style="stroke"
        strokeWidth={1}
      />
      <YTicks {...props} />
    </>
  );
};

export default YAxis;
