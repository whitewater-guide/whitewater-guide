import { createChartView } from '@whitewater-guide/clients';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';

import {
  HorizontalGrid,
  HorizontalLabel,
  HorizontalTick,
  TimeLabel,
} from '~/components/chart';

import { DescentTimeGrid } from './DescentTimeGrid';
import { DescentTimeLabel } from './DescentTimeLabel';

const DescentChartComponent = createChartView(
  {
    ChartComponent: VictoryChart,
    AxisComponent: VictoryAxis,
    LineComponent: VictoryLine,
    TimeLabelComponent: DescentTimeLabel,
    TimeGridComponent: DescentTimeGrid,
    HorizontalTickComponent: HorizontalTick,
    HorizontalLabelComponent: HorizontalLabel,
    HorizontalGridComponent: HorizontalGrid,
  },
  {
    yTicks: 5,
    yDeltaRatio: 8,
    timeAxisSettings: { tickCount: 16, tickFormat: 'HH:mm' },
  },
);

export default DescentChartComponent;
