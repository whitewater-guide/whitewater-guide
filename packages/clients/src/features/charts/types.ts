import {
  Gauge,
  Measurement,
  MeasurementsFilter,
  Section,
  Unit,
} from '@whitewater-guide/commons';

export interface ChartProps {
  gauge: Gauge;
  section?: Section;
}

export interface ChartContext extends ChartProps {
  filter: MeasurementsFilter<Date>;
  onChangeFilter: (value: MeasurementsFilter<Date>) => void;
  unit: Unit;
  unitChangeable: boolean;
  onChangeUnit: (unit: Unit) => void;
}

export interface WithMeasurements {
  measurements: {
    data: Array<Measurement<Date>>;
    loading: boolean;
    refresh: () => void;
  };
}
