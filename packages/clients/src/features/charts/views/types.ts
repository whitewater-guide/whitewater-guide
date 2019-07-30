import { Gauge, Measurement, Section, Unit } from '@whitewater-guide/commons';
import React from 'react';
import {
  TextAnchorType,
  VictoryAxisProps,
  VictoryChartProps,
  VictoryLabelProps,
  VictoryLineProps,
} from 'victory';

export enum Period {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export interface ChartMeta {
  domain: {
    x: [Date, Date];
    y: [number, number];
  };
  yTickValues: number[];
  period: Period;
  xTickFormat: (date: Date) => string;
  xTickCount: number;
}

export interface ChartViewProps {
  width?: number;
  height?: number;
  data: Array<Measurement<Date>>;
  unit: Unit;
  gauge: Gauge;
  section?: Section;
  days: number;
}

export interface ChartMetaSettings {
  yDeltaRatio?: number;
  yTicks?: number;
}

export interface TimeLabelProps extends VictoryLabelProps {
  period: Period;
}

export interface TimeGridProps extends VictoryLineProps {
  period: Period;
  datum?: Date;
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
