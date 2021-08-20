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
} from '~/components/chart';

import { DescentTimeGrid } from './DescentTimeGrid';
import { DescentTimeLabel } from './DescentTimeLabel';

const VictoryZoomVoronoiContainer = createContainer<
  VictoryZoomContainerProps,
  VictoryVoronoiContainerProps
>('zoom', 'voronoi');

const DescentChartComponent = createChartView(
  {
    ChartComponent: VictoryChart,
    AxisComponent: VictoryAxis,
    ScatterComponent: VictoryScatter,
    TooltipComponent: VictoryTooltip,
    LineComponent: VictoryLine,
    TimeLabelComponent: DescentTimeLabel,
    TimeGridComponent: DescentTimeGrid,
    HorizontalTickComponent: HorizontalTick,
    HorizontalLabelComponent: HorizontalLabel,
    HorizontalGridComponent: HorizontalGrid,
    ZoomVoronoiComponent: VictoryZoomVoronoiContainer,
  },
  {
    yTicks: 5,
    yDeltaRatio: 8,
    timeAxisSettings: { tickCount: 16, tickFormat: 'HH:mm' },
  },
);

export default DescentChartComponent;
