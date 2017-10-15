import { NamedResource, Timestamped } from '../../core/types';
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
  id: string;
  sourceId: string;
  location: PointInput | null;
  name: string;
  code: string;
  levelUnit?: string | null;
  flowUnit?: string | null;
  requestParams?: any;
  cron?: string | null;
  url?: string | null;
}
