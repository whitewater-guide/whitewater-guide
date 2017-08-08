import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db/types';
import { NamedResource } from '../../ww-commons';

export const GaugesSchema = loadGraphqlFile('gauges');

export interface GaugeRaw extends NamedResource, RawTimestamped {
  code: string;
  source_id: string;
  // source: Source!
  // location: Point
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
