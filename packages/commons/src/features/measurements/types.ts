export interface Measurement<TDate = string> {
  timestamp: TDate;
  level: number;
  flow: number;
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
