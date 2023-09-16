import { createChartView } from '@whitewater-guide/clients';
import type {
  VictoryVoronoiContainerProps,
  VictoryZoomContainerProps,
} from 'victory-native';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryClipContainer,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import {
  Crosshair,
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
    ClipContainerComponent: VictoryClipContainer,
    AxisComponent: VictoryAxis,
    ScatterComponent: VictoryScatter,
    TooltipComponent: Crosshair,
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
