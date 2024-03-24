import React, { FC } from 'react';

import { ChartMeta } from './useChartMeta';
import XAxis from './XAxis';
import YAxis from './YAxis';

interface GridProps extends ChartMeta {
  width: number;
  height: number;
}

const Grid: FC<GridProps> = (props) => {
  return (
    <>
      <XAxis {...props} />
      <YAxis {...props} />
    </>
  );
};

export default Grid;
