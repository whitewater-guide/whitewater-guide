import { NamedNode, Node, NodeRef, Timestamped } from '../../apollo';
import { HarvestStatus, Measurement } from '../measurements';
import { Point, PointInput } from '../points';
import { Source } from '../sources';

export interface Gauge<RP = any> extends NamedNode, Timestamped {
  code: string;
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: RP;
  url: string | null;
  enabled: boolean;
  location: Point | null;
  source: Source;
  // measurements?: Measurement[];
  latestMeasurement: Measurement | null;
  lastMeasurement: Measurement | null; // @deprecated, renamed to latestMeasurement
  status: HarvestStatus | null;
}

export interface GaugeInput<RP = any> {
  id: string | null;
  name: string;
  source: NodeRef;
  location: PointInput | null;
  code: string;
  levelUnit: string | null;
  flowUnit: string | null;
  requestParams: RP;
  url: string | null;
}

export interface GaugesFilter {
  search?: string;
  regionId?: string;
  sourceId?: string;
}

export const isGauge = (node?: Node | null): node is Gauge =>
  !!node && node.__typename === 'Gauge';
