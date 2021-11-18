import { createChartView } from '@whitewater-guide/clients';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryClipContainer,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainerProps,
  VictoryZoomContainerProps,
} from 'victory-native';

import {
  Crosshair,
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
    ClipContainerComponent: VictoryClipContainer,
    AxisComponent: VictoryAxis,
    ScatterComponent: VictoryScatter,
    TooltipComponent: Crosshair,
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
