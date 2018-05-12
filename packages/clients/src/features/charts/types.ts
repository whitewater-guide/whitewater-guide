import { ReactElement } from 'react';
import { Gauge, GaugeBinding, Measurement, Section, Unit } from '../../../ww-commons';
import { WithMeasurements } from '../measurements';

export interface InteractiveChartOuterProps {
  gauge: Gauge;
  section?: Section;
}

export interface DaysState {
  days: number;
}

export interface DaysStateUpdaters {
  onChangeDays: (days: number) => void;
}

export interface UnitState {
  unit: Unit;
  unitChangeable: boolean;
}

export interface UnitStateUpdaters {
  onChangeUnit: (unit: Unit) => void;
}

export type InteractiveChartInnerProps =
  InteractiveChartOuterProps &
  DaysState &
  DaysStateUpdaters &
  UnitState &
  UnitStateUpdaters &
  WithMeasurements;

export interface ChartComponentProps {
  data: Measurement[];
  loading: boolean;
  unit: Unit;
  gauge: Gauge;
  section?: Section;
}

export interface FlowToggleProps {
  enabled: boolean;
  unit: Unit;
  unitName: string;
  loading: boolean;
  gauge: Gauge;
  onChange: (unit: Unit) => void;
}

export interface PeriodToggleProps {
  days: number;
  onChange: (days: number) => void;
  loading: boolean;
}

export interface ChartLayoutProps {
  gauge: Gauge;
  section?: Section;
  chart: ReactElement<ChartComponentProps>;
  flowToggle: ReactElement<FlowToggleProps>;
  periodToggle: ReactElement<PeriodToggleProps>;
}
