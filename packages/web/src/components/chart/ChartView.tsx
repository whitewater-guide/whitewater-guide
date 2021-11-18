import { createChartView } from '@whitewater-guide/clients';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryClipContainer,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import Crosshair from './Crosshair';
import HorizontalGrid from './HorizontalGrid';
import HorizontalLabel from './HorizontalLabel';
import HorizontalTick from './HorizontalTick';
import TimeGrid from './TimeGrid';
import TimeLabel from './TimeLabel';

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

const ChartView = createChartView(
  {
    ChartComponent: VictoryChart,
    ClipContainerComponent: VictoryClipContainer,
    AxisComponent: VictoryAxis,
    LineComponent: VictoryLine,
    ScatterComponent: VictoryScatter,
    TooltipComponent: Crosshair,
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
