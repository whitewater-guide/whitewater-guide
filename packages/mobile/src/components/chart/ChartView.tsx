import { createChartView } from '@whitewater-guide/clients';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import HorizontalGrid from './HorizontalGrid';
import HorizontalLabel from './HorizontalLabel';
import HorizontalTick from './HorizontalTick';
import TimeGrid from './TimeGrid';
import TimeLabel from './TimeLabel';

const ChartView = createChartView(
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

export default ChartView;
