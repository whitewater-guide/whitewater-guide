import { Unit } from '@whitewater-guide/schema';
import type { FC } from 'react';
import useResizeObserver from 'use-resize-observer';

import Chart from './Chart';
import data from './data';

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
        <Chart
          data={data}
          unit={Unit.FLOW}
          width={Math.max(width, 800)}
          height={Math.max(height, 500)}
        />
      )}
    </div>
  );
};

export default ChartWebBox;
