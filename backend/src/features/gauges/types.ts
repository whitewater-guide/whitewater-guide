import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource } from '../../apollo/types';

export const GaugesSchema = loadGraphqlFile('gauges');

export interface GaugeRaw extends NamedResource, RawTimestamped {
  code: string;
  source_id: string;
  request_params?: any;
  cron?: string | null;
  last_timestamp?: Date | null;
  level_unit?: string | null;
  flow_unit?: string | null;
  last_level?: number | null;
  last_flow?: number | null;
  url?: string | null;
  enabled?: boolean;
}
