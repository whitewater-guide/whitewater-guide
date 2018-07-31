export interface RedisLastMeasurement {
  script: string;
  code: string;
  timestamp: string;
  level: number;
  flow: number;
}

export interface RedisLastMeasurements {
  [key: string]: RedisLastMeasurement;
}

export type LastMeasurement = RedisLastMeasurement | null;
