import { NamedResource, Timestamped } from '../../core';
import { Measurement } from '../measurements';

export interface Gauge extends NamedResource, Timestamped {
  code: string;
  // source: Source!
  // location: Point
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: any;
  cron: string | null;
  lastTimestamp: Date | null;
  lastLevel: number | null;
  lastFlow: number | null;
  url: string | null;
  enabled: boolean;
  measurements?: Measurement[];
}

export interface GaugeInput {
  id: string;
  sourceId: string;
  name: string;
  code: string;
  levelUnit?: string | null;
  flowUnit?: string | null;
  requestParams?: any;
  cron?: string | null;
  url?: string | null;
}
