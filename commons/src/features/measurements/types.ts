export interface GaugeMeasurement {
  date: Date;
  level: number;
  flow: number;
}

export interface Measurement extends GaugeMeasurement {
  id: string;
  gaugeId: string;
}

export enum Unit {
  FLOW = 'flow',
  LEVEL = 'level',
}
