export interface MeasurementRaw {
  script: string;
  code: string;
  timestamp: Date;
  flow: number | null;
  level: number | null;
}

export interface WorkerMeasurement {
  script: string;
  code: string;
  timestamp: string;
  level?: number;
  flow?: number;
}
