export interface Measurement {
  timestamp: Date;
  level: number;
  flow: number;
}

export enum Unit {
  FLOW = 'flow',
  LEVEL = 'level',
}

export interface HarvestStatus {
  count: number;
  success: boolean;
  timestamp: Date;
  error: string | null;
}
