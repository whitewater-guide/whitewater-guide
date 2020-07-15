export interface Measurement<TDate = string> {
  timestamp: TDate;
  level: number | null;
  flow: number | null;
}

export enum Unit {
  FLOW = 'flow',
  LEVEL = 'level',
}

export interface HarvestStatus<TDate = string> {
  count: number;
  success: boolean;
  timestamp: TDate;
  next: TDate;
  error: string | null;
}

export interface MeasurementsFilter<TDate = string> {
  from?: TDate | null;
  to?: TDate | null;
}
