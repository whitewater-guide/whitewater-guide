import { HarvestMode } from '../../ww-commons';

export interface ScriptDescription {
  name: string;
  mode: HarvestMode;
}

export enum ScriptCommand {
  LIST = 'list',
  AUTOFILL = 'autofill',
  HARVEST = 'harvest',
}

export interface ScriptPayload {
  command: ScriptCommand;
  script?: string;
  code?: string;
  since?: number;
  extras?: {[key: string]: string | number | boolean };
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
