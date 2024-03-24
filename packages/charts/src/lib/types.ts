import { ApolloError } from '@apollo/client';
import {
  GaugeForChartFragment,
  Measurement,
  MeasurementsFilter,
  Node,
  SectionFlowsFragment,
  Unit,
} from '@whitewater-guide/schema';
import { Overwrite } from 'utility-types';

export interface XMeta {
  days: number;
  xTickValues: Date[];
  xTickFormat: (date: Date, index: number, ticks: Date[]) => string;
}

export interface ChartViewProps {
  width: number;
  height: number;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
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
  xTicks?: number;
  timeAxisSettings?: TimeAxisSettings;
  maxDensity?: number; // min pixel distance between two chart points
}

export type ExtendedTooltipProps = Pick<
  ChartViewProps,
  'unit' | 'gauge' | 'section' | 'highlightedDate'
>;

export interface ChartProps {
  gauge: GaugeForChartFragment;
  section?: Node & SectionFlowsFragment;
}

export interface ChartContext extends ChartProps {
  filter: MeasurementsFilter;
  onChangeFilter: (value: MeasurementsFilter) => void;
  unit: Unit;
  unitChangeable: boolean;
  onChangeUnit: (unit: Unit) => void;
}

export type ChartDataPoint = Overwrite<Measurement, { timestamp: Date }>;

export interface WithChartData {
  measurements: {
    data: ChartDataPoint[];
    error?: ApolloError | null;
    loading: boolean;
    refresh: () => Promise<void>;
  };
}
