import { Line as SkLine } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

import { useChartGeometry } from '../../../components/chart/ChartGeometryContext';

interface Props {
  date: Date;
}

function DescentHighlightedLine({ date }: Props) {
  const { tsToX, chartBounds } = useChartGeometry();
  const x = tsToX(date.getTime());
  return (
    <SkLine
      p1={{ x, y: chartBounds.top }}
      p2={{ x, y: chartBounds.bottom }}
      color="#AAA"
      strokeWidth={StyleSheet.hairlineWidth * 2}
    />
  );
}

export default DescentHighlightedLine;
