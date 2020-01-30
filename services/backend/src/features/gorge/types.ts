import { HarvestMode } from '@whitewater-guide/commons';

export interface GorgeScript {
  name: string;
  mode: HarvestMode;
}

export interface GorgeGauge {
  script: string;
  code: string;
  name: string;
  url?: string;
  levelUnit?: string;
  flowUnit?: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
}

export interface GorgeJob {
  id: string;
  script: string;
  gauges: Record<string, Record<string, any>>;
  cron: string;
  options?: Record<string, any>;
  status?: GorgeStatus;
}

export interface GorgeStatus {
  count: number;
  success: boolean;
  timestamp: string;
  error?: string;
}

export interface GorgeError {
  error: string;
  status?: string;
  request_id?: string;
}

export interface GorgeMeasurement {
  script: string;
  code: string;
  timestamp: string;
  level: number | null;
  flow: number | null;
}

// job from jobs_view
export interface JobRaw {
  id: string; // same as source_id
  cron: string | null;
  script: string;
  request_params: any;
  gauges: { [gaugeId: string]: any } | null;
}
