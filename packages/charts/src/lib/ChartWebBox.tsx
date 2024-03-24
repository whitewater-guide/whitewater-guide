import React, { FC } from 'react';
import useResizeObserver from 'use-resize-observer';

import Chart from './Chart';

const ChartWebBox: FC = () => {
  const { height, ref, width } = useResizeObserver();
  return (
    <div ref={ref} style={{ flex: 1 }}>
      {!!width && !!height && <Chart width={width} height={height} />}
    </div>
  );
};

export default ChartWebBox;
