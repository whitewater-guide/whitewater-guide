import type { ChartViewProps } from '@whitewater-guide/clients';
import { format } from 'date-fns-tz';

import ChartComponent from '../../../components/chart/ChartComponent';
import {
  ChartOverlay,
  ChartSkiaLayer,
} from '../../../components/chart/ChartGeometryContext';
import DescentHighlightedLabel from './DescentHighlightedLabel';
import DescentHighlightedLine from './DescentHighlightedLine';

interface Props extends ChartViewProps {
  highlightedDate: Date;
  timezone: string;
}

function DescentChartView({ highlightedDate, timezone, ...props }: Props) {
  return (
    <ChartComponent
      {...props}
      labelRotate={90}
      xTickIntervalMs={3 * 3_600_000}
      formatXLabel={(ts) => format(new Date(ts), 'HH:mm')}
      longPressDelay={300}
    >
      <ChartSkiaLayer>
        <DescentHighlightedLine date={highlightedDate} />
      </ChartSkiaLayer>
      <ChartOverlay>
        <DescentHighlightedLabel date={highlightedDate} timezone={timezone} />
      </ChartOverlay>
    </ChartComponent>
  );
}

export default DescentChartView;
