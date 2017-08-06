import { ReactElement } from 'react';
import { GaugeMeasurement, Unit } from '../measurements';
import { Binding } from '../sections';

export interface ChartComponentProps {
  binding: Binding;
  data: GaugeMeasurement[];
  unit: Unit;
  domain: [Date, Date];
  levelUnit: string | null;
  flowUnit: string | null;
  onDomainChanged?: (domain: {x: [Date, Date] }) => void;
}

export interface FlowToggleProps {
  enabled: boolean;
  measurement: Unit;
  unit: string | null;
  value: number;
  onChange: (unit: Unit) => void;
}

export interface PeriodToggleProps {
  onChange: (days: number) => void;
  loading: boolean;
  startDate: Date;
  endDate: Date;
}

export interface ChartLayoutProps {
  chart: ReactElement<ChartComponentProps>;
  flowToggle: ReactElement<FlowToggleProps>;
  periodToggle: ReactElement<PeriodToggleProps>;
}
