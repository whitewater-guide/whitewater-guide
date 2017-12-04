import { ReactElement } from 'react';
import { GaugeBinding, GaugeMeasurement, Unit } from '../../../ww-commons';

export interface ChartComponentProps {
  binding: GaugeBinding;
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
  value: number | null;
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
