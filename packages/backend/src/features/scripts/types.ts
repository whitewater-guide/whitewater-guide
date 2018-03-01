import { HarvestMode } from '../../ww-commons';

export interface ScriptDescribeResponse {
  name: string;
  mode: HarvestMode;
}

export interface ScriptResponse<Raw> {
  success: boolean;
  error?: string;
  data?: Raw[];
}

export interface ScriptLocation {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface ScriptGaugeInfo {
  script: string;
  code: string;
  name: string;
  url: string;
  levelUnit: string;
  flowUnit: string;
  location: ScriptLocation;
}

export interface ScriptMeasurement {
  script: string;
  code: string;
  timestamp: string;
  level: number;
  flow: number;
}

export enum ScriptOperation {
  DESCRIBE = 'describe',
  AUTOFILL = 'autofill',
  HARVEST = 'harvest',
}

export interface HarvestOptions {
  code?: string;
  sinceEpoch?: number;
  requestParams?: {[key: string]: string | number };
}
