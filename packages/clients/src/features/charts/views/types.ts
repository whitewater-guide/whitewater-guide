import type {
  GaugeForChartFragment,
  MeasurementsFilter,
  Node,
  SectionFlowsFragment,
  Unit,
} from '@whitewater-guide/schema';
import type React from 'react';
import type {
  VictoryScatterProps,
  VictoryTooltipProps,
  VictoryVoronoiContainerProps,
  VictoryZoomContainerProps,
} from 'victory';
import type { VictoryAxisProps } from 'victory-axis';
import type { VictoryChartProps } from 'victory-chart';
import type {
  TextAnchorType,
  VictoryClipContainerProps,
  VictoryLabelProps,
} from 'victory-core';
import type { VictoryLineProps } from 'victory-line';

import type { ChartDataPoint } from '../types';

export interface DomainMeta {
  domain: {
    x: [Date, Date];
    y: [number, number];
  };
  yTickValues: number[];
}
export interface XMeta {
  days: number;
  xTickValues: Date[];
  xTickFormat: (date: Date, index: number, ticks: Date[]) => string;
}

export interface ChartViewProps {
  width: number;
  height: number;
  // dates in this array should be in gauge's timezone
  data: Array<ChartDataPoint>;
  unit: Unit;
  gauge: GaugeForChartFragment;
  section?: Node & SectionFlowsFragment;
  filter: MeasurementsFilter;
  // date gauge's timezone
  highlightedDate?: Date;
}

export interface TimeAxisSettings {
  tickFormat: string | ((date: Date, index: number, ticks: Date[]) => string);
  tickCount: number;
}

export interface ChartMetaSettings {
  yDeltaRatio?: number;
  yTicks?: number;
  timeAxisSettings?: TimeAxisSettings;
  maxDensity?: number; // min pixel distance between two chart points
}

export interface TimeLabelProps extends VictoryLabelProps {
  days: number;
  highlightedDate?: Date;
}

export interface TimeGridProps extends VictoryLineProps {
  days: number;
  datum?: Date;
  highlightedDate?: Date;
}

export interface HorizontalTickProps {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  style?: any;
  color?: string;
}

export interface HorizontalLabelProps {
  x?: number;
  y?: number;
  textAnchor?: TextAnchorType;
  datum?: number;
  style?: any;
  color?: string;
}

export interface HorizontalGridProps {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  label?: string;
  style?: any;
  color?: string;
}

export type ExtendedTooltipProps = Pick<
  ChartViewProps,
  'unit' | 'gauge' | 'section' | 'highlightedDate'
>;

export interface ChartComponents {
  ChartComponent: React.ComponentType<VictoryChartProps>;
  ClipContainerComponent: React.ComponentType<VictoryClipContainerProps>;
  ScatterComponent: React.ComponentType<VictoryScatterProps>;
  TooltipComponent: React.ComponentType<
    VictoryTooltipProps & ExtendedTooltipProps
  >;
  AxisComponent: React.ComponentType<VictoryAxisProps>;
  LineComponent: React.ComponentType<VictoryLineProps>;
  TimeLabelComponent: React.ComponentType<TimeLabelProps>;
  TimeGridComponent: React.ComponentType<TimeGridProps>;
  HorizontalTickComponent: React.ComponentType<HorizontalTickProps>;
  HorizontalLabelComponent: React.ComponentType<HorizontalLabelProps>;
  HorizontalGridComponent: React.ComponentType<HorizontalGridProps>;
  ZoomVoronoiComponent: React.ComponentType<
    VictoryZoomContainerProps & VictoryVoronoiContainerProps
  >;
}
