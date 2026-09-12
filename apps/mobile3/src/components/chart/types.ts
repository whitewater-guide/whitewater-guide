import type { ApolloError } from '@apollo/client';
import type { Unit } from '@whitewater-guide/schema';

export interface GaugeBindingValues {
  minimum?: number | null;
  maximum?: number | null;
  optimum?: number | null;
  impossible?: number | null;
  approximate?: boolean | null;
  formula?: string | null;
}

export interface GaugeLatestMeasurement {
  timestamp: string;
  flow?: number | null;
  level?: number | null;
}

export interface GaugeSourceInfo {
  id: string;
  name: string;
  termsOfUse?: string | null;
}

export interface GaugeForChart {
  id: string;
  name: string;
  code: string;
  flowUnit?: string | null;
  levelUnit?: string | null;
  url?: string | null;
  timezone?: string | null;
  source: GaugeSourceInfo;
  latestMeasurement?: GaugeLatestMeasurement | null;
}

export interface SectionForChart {
  id: string;
  flowsText?: string | null;
  timezone?: string | null;
  flows?: GaugeBindingValues | null;
  levels?: GaugeBindingValues | null;
}

export interface MeasurementsFilter {
  from?: string | null;
  to?: string | null;
}

export interface ChartDataPoint {
  timestamp: Date;
  flow?: number | null;
  level?: number | null;
}

export interface ChartProps {
  gauge: GaugeForChart;
  section?: SectionForChart;
}

export interface ChartMeasurementsState {
  data: ChartDataPoint[];
  error?: ApolloError | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export interface ChartContextValue extends ChartProps {
  filter: MeasurementsFilter;
  onChangeFilter: (value: MeasurementsFilter) => void;
  unit: Unit;
  unitChangeable: boolean;
  onChangeUnit: (unit: Unit) => void;
  measurements: ChartMeasurementsState;
}

export interface ChartViewProps {
  width: number;
  height: number;
  data: ChartDataPoint[];
  unit: Unit;
  gauge: GaugeForChart;
  section?: SectionForChart;
  filter: MeasurementsFilter;
}

export type FlowFormula = (x: number | null) => number | null;

export interface Formulas {
  flows: FlowFormula;
  levels: FlowFormula;
}
