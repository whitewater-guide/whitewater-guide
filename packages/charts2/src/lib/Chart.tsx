/* eslint-disable react/style-prop-object */
import { Canvas, Group, Skia } from '@shopify/react-native-skia';
import { type FC, useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { GestureHandler } from './GestureHandler';
import LineChart from './LineChart';
import { getChartData } from './math';
import type { ChartViewProps } from './types';
import XAxis from './XAxis';
import XGrid from './XGrid';
import YAxis from './YAxis';

const Chart: FC<ChartViewProps> = (props) => {
  const { data, unit, ...canvasParams } = props;
  const { width, height } = canvasParams;
  const matrix = useSharedValue(Skia.Matrix());

  const chartData = useMemo(
    () => getChartData(data, unit, canvasParams),
    [data, unit, canvasParams],
  );

  return (
    <GestureHandler
      matrix={matrix}
      width={width}
      height={height}
      padding={chartData.padding}
    >
      <Canvas style={{ width, height }}>
        <Group
          clip={{
            x: chartData.padding.left,
            y: chartData.padding.top / 2,
            width: width - chartData.padding.left - chartData.padding.right / 2,
            height:
              height - chartData.padding.top / 2 - chartData.padding.bottom,
          }}
        >
          <XGrid matrix={matrix} data={chartData} />

          <LineChart
            data={chartData}
            width={width}
            height={height}
            matrix={matrix}
          />
        </Group>

        <XAxis width={width} height={height} padding={chartData.padding} />
        <YAxis width={width} height={height} padding={chartData.padding} />
      </Canvas>
    </GestureHandler>
  );
};

export default Chart;
