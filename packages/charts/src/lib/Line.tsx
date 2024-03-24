import { Path, Skia } from '@shopify/react-native-skia';
import type { Unit } from '@whitewater-guide/schema';
import { curveBasis, line } from 'd3';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import type { ChartDataPoint } from './types';
import type { ChartMeta } from './useChartMeta';

interface LineProps extends ChartMeta {
  data: ChartDataPoint[];
  unit: Unit;
}

const Line: FC<LineProps> = (props) => {
  const { xScale, yScale, unit, data } = props;

  const path = useMemo(() => {
    const curvedLine = line<ChartDataPoint>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d[unit]!))
      .curve(curveBasis)(data);

    return Skia.Path.MakeFromSVGString(curvedLine!)?.toSVGString() ?? '0';
  }, [xScale, yScale, unit, data]);

  return <Path style="stroke" path={path} strokeWidth={2} color="#6231ff" />;
};

export default Line;
