import { NamedResource, Resource, Timestamped } from '../../core';
import { Point, PointInput } from '../points';
import { Source } from '../sources';

export interface Gauge extends NamedResource, Timestamped {
  code: string;
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: any;
  cron: string | null;
  lastTimestamp: Date | null;
  lastLevel: number | null;
  lastFlow: number | null;
  url: string | null;
  enabled: boolean;
  location: Point;
  source: Source;
  // measurements?: Measurement[];
}

export interface GaugeInput {
  id: string | null;
  name: string;
  source: Resource;
  location: PointInput | null;
  code: string;
  levelUnit?: string | null;
  flowUnit?: string | null;
  requestParams: any;
  cron?: string | null;
  url?: string | null;
}
