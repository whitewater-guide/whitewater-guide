import { createChartView } from '@whitewater-guide/clients';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainerProps,
  VictoryZoomContainerProps,
} from 'victory-native';

import {
  HorizontalGrid,
  HorizontalLabel,
  HorizontalTick,
  TimeGrid,
  TimeLabel,
} from '~/components/chart';

const VictoryZoomVoronoiContainer = createContainer<
  VictoryZoomContainerProps,
  VictoryVoronoiContainerProps
>('zoom', 'voronoi');

const ChartComponent = createChartView(
  {
    ChartComponent: VictoryChart,
    AxisComponent: VictoryAxis,
    ScatterComponent: VictoryScatter,
    TooltipComponent: VictoryTooltip,
    LineComponent: VictoryLine,
    TimeLabelComponent: TimeLabel,
    TimeGridComponent: TimeGrid,
    HorizontalTickComponent: HorizontalTick,
    HorizontalLabelComponent: HorizontalLabel,
    HorizontalGridComponent: HorizontalGrid,
    ZoomVoronoiComponent: VictoryZoomVoronoiContainer,
  },
  { yTicks: 5, yDeltaRatio: 8 },
);

export default ChartComponent;
