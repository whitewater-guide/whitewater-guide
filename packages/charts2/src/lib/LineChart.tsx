import type { SkMatrix } from '@shopify/react-native-skia';
import { LinearGradient, Path, vec } from '@shopify/react-native-skia';
import type { FC } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';

import type { ChartData } from './math';

interface LineChartProps {
  matrix: SharedValue<SkMatrix>;
  data: ChartData;
  width: number;
  height: number;
}

const LineChart: FC<LineChartProps> = ({ matrix, data, width, height }) => {
  const { path } = data;

  const line = useDerivedValue(() => {
    return path.copy().transform(matrix.value);
  }, [matrix, path]);

  return (
    <Path style="stroke" path={line} strokeWidth={2}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(width, height)}
        colors={['blue', 'yellow']}
      />
    </Path>
  );
};

export default LineChart;
