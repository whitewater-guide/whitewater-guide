import { RawTimestamped } from '../../db';
import { NamedNode } from '../../ww-commons';
import { PointRaw } from '../points';

export interface GaugeRaw extends NamedNode, RawTimestamped {
  code: string;
  source_id: string;
  location: PointRaw;
  level_unit: string | null;
  flow_unit: string | null;
  request_params: any;
  cron: string | null;
  last_timestamp: Date | null;
  last_level: number | null;
  last_flow: number | null;
  url: string | null;
  enabled: boolean;
}
