import { Unit } from '@whitewater-guide/schema';
import type { FC } from 'react';
import useResizeObserver from 'use-resize-observer';

import Chart from './Chart';
import data from './data';

const ChartWebBox: FC = () => {
  const { height, ref, width } = useResizeObserver();
  return (
    <div
      id="chart_container"
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffd',
        position: 'relative',
      }}
    >
      {!!width && !!height && (
        <Chart data={data} unit={Unit.FLOW} width={width} height={height} />
      )}
    </div>
  );
};

export default ChartWebBox;
