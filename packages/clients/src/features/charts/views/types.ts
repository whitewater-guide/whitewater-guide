import {
  GaugeForChartFragment,
  MeasurementsFilter,
  Node,
  SectionFlowsFragment,
  Unit,
} from '@whitewater-guide/schema';
import React from 'react';
import { VictoryAxisProps } from 'victory-axis';
import { VictoryChartProps } from 'victory-chart';
import { TextAnchorType, VictoryLabelProps } from 'victory-core';
import { VictoryLineProps } from 'victory-line';

import { ChartDataPoint } from '../types';

export interface ChartMeta {
  days: number;
  domain: {
    x: [Date, Date];
    y: [number, number];
  };
  yTickValues: number[];
  xTickValues: Date[];
  xTickFormat: (date: Date) => string;
}

export interface ChartViewProps {
  width: number;
  height: number;
  data: Array<ChartDataPoint>;
  unit: Unit;
  gauge: GaugeForChartFragment;
  section?: Node & SectionFlowsFragment;
  filter: MeasurementsFilter;
  highlightedDate?: Date;
}

export interface TimeAxisSettings {
  tickFormat: string;
  tickCount: number;
}

export interface ChartMetaSettings {
  yDeltaRatio?: number;
  yTicks?: number;
  timeAxisSettings?: TimeAxisSettings;
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

export interface ChartComponents {
  ChartComponent: React.ComponentType<VictoryChartProps>;
  AxisComponent: React.ComponentType<VictoryAxisProps>;
  LineComponent: React.ComponentType<VictoryLineProps>;
  TimeLabelComponent: React.ComponentType<TimeLabelProps>;
  TimeGridComponent: React.ComponentType<TimeGridProps>;
  HorizontalTickComponent: React.ComponentType<HorizontalTickProps>;
  HorizontalLabelComponent: React.ComponentType<HorizontalLabelProps>;
  HorizontalGridComponent: React.ComponentType<HorizontalGridProps>;
}
