import { createChartView } from '@whitewater-guide/clients';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import HorizontalGrid from './HorizontalGrid';
import HorizontalLabel from './HorizontalLabel';
import HorizontalTick from './HorizontalTick';
import TimeGrid from './TimeGrid';
import TimeLabel from './TimeLabel';

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

const ChartView = createChartView(
  {
    ChartComponent: VictoryChart,
    AxisComponent: VictoryAxis,
    LineComponent: VictoryLine,
    ScatterComponent: VictoryScatter,
    TooltipComponent: VictoryTooltip,
    TimeLabelComponent: TimeLabel,
    TimeGridComponent: TimeGrid,
    HorizontalTickComponent: HorizontalTick,
    HorizontalLabelComponent: HorizontalLabel,
    HorizontalGridComponent: HorizontalGrid,
    ZoomVoronoiComponent: VictoryZoomVoronoiContainer as any,
  },
  { yTicks: 10, yDeltaRatio: 20 },
);

export default ChartView;
