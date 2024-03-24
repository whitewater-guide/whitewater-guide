import type { FC } from 'react';
import React from 'react';
import useResizeObserver from 'use-resize-observer';

import Chart from './Chart';

const ChartWebBox: FC = () => {
  const { height, ref, width } = useResizeObserver();
  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffd',
      }}
    >
      {!!width && !!height && (
        <Chart width={Math.min(width, 800)} height={Math.min(height, 500)} />
      )}
    </div>
  );
};

export default ChartWebBox;
