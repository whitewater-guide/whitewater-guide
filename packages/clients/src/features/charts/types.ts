import { Gauge, Measurement, Section, Unit } from '@whitewater-guide/commons';

export interface ChartProps {
  gauge: Gauge;
  section?: Section;
}

export interface ChartContext extends ChartProps {
  days: number;
  onChangeDays: (days: number) => void;
  unit: Unit;
  unitChangeable: boolean;
  onChangeUnit: (unit: Unit) => void;
}

export interface WithMeasurements {
  measurements: {
    data: Measurement[];
    loading: boolean;
    refresh: () => void;
  };
}
