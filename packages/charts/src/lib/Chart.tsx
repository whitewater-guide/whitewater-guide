import { Canvas } from '@shopify/react-native-skia';
import { Unit } from '@whitewater-guide/schema';
import React, { FC } from 'react';

import data from './data';
import Grid from './Grid';
import Line from './Line';
import useChartMeta from './useChartMeta';

interface ChartProps {
  width: number;
  height: number;
}

const Chart: FC<ChartProps> = ({ width, height }) => {
  const meta = useChartMeta({
    data,
    width,
    height,
    padding: { left: 200, right: 20, top: 20, bottom: 50 },
    unit: Unit.FLOW,
    filter: {
      from: data[0].timestamp,
      to: data[data.length - 1].timestamp,
    },
    gauge: {
      id: '1',
      code: '2',
      name: '3',
      source: { id: '4', name: '5' },
    },
  });

  return (
    <div>
      <Canvas
        style={{
          width,
          height,
        }}
      >
        <Grid {...meta} width={width} height={height - 20} />
        <Line {...meta} data={data} unit={Unit.FLOW} />
      </Canvas>
    </div>
  );
};

export default Chart;
