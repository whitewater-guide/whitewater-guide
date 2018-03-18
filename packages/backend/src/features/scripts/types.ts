import { HarvestMode } from '../../ww-commons';

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

export interface ScriptResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface ScriptDescription {
  name: string;
  mode: HarvestMode;
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
