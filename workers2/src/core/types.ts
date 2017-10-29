export interface Location {
  type: 'Point';
  coordinates: [number, number, number];
  kind: 'gauge';
}

export interface Gauge {
  name: string;
  code: string;
  location?: Location;
  timestamp: number; // unix timestamp in ms
  level: number;
  flow: number;
  url: string;
  enabled: boolean;
}

export interface Measurement {
  code: string;
  timestamp: number; // unix timestamp in ms
  level: number;
  flow: number;
}

export type AutofillCallback = (error: Error | null, gauges: Gauge[] | null) => void;
export type AutofillHandler = (callback: AutofillCallback) => void;
export type HarvestCallback = (error: Error | null, measurements: Measurement[] | null) => void;
export type HarvestHandler = (options: Record<string, any> | null, callback: HarvestCallback) => void;
