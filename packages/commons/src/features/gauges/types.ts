import { NamedNode, Node, Timestamped } from '../../core';
import { HarvestStatus, Measurement } from '../measurements';
import { Point, PointInput } from '../points';
import { Source } from '../sources';

export interface Gauge extends NamedNode, Timestamped {
  code: string;
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: any;
  cron: string | null;
  url: string | null;
  enabled: boolean;
  location: Point;
  source: Source;
  // measurements?: Measurement[];
  lastMeasurement: Measurement | null;
  status: HarvestStatus | null;
}

export interface GaugeInput {
  id: string | null;
  name: string;
  source: Node;
  location: PointInput | null;
  code: string;
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: any;
  cron: string | null;
  url: string | null;
}
