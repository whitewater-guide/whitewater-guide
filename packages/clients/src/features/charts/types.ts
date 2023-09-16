import type { ApolloError } from '@apollo/client';
import type {
  GaugeForChartFragment,
  Measurement,
  MeasurementsFilter,
  Node,
  SectionFlowsFragment,
  Unit,
} from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

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
