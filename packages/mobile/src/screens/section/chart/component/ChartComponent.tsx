import { createChartView } from '@whitewater-guide/clients';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import {
  HorizontalGrid,
  HorizontalLabel,
  HorizontalTick,
  TimeGrid,
  TimeLabel,
} from '~/components/chart';

const ChartComponent = createChartView(
  {
    ChartComponent: VictoryChart,
    AxisComponent: VictoryAxis,
    LineComponent: VictoryLine,
    TimeLabelComponent: TimeLabel,
    TimeGridComponent: TimeGrid,
    HorizontalTickComponent: HorizontalTick,
    HorizontalLabelComponent: HorizontalLabel,
    HorizontalGridComponent: HorizontalGrid,
  },
  { yTicks: 5, yDeltaRatio: 8 },
);

export default ChartComponent;
