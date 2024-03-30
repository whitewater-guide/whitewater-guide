import type { Measurement, Unit } from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

export type ChartDataPoint = Overwrite<Measurement, { timestamp: Date }>;

export interface CanvasDimensions {
  height: number;
  width: number;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
}

export interface ChartViewProps extends CanvasDimensions {
  // dates in this array should be in gauge's timezone
  data: Array<ChartDataPoint>;
  unit: Unit;
  // gauge: GaugeForChartFragment;
  // section?: Node & SectionFlowsFragment;
  // filter: MeasurementsFilter;
  // date gauge's timezone
  // highlightedDate?: Date;
}
