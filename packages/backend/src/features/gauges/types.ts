import { RawTimestamped } from '@db';
import { PointRaw } from '@features/points';
import { SourceRaw } from '@features/sources';
import { NamedNode } from '@ww-commons';

export interface GaugeRaw extends NamedNode, RawTimestamped {
  code: string;
  source_id: string;
  script: string;
  location: PointRaw;
  level_unit: string | null;
  flow_unit: string | null;
  request_params: any;
  cron: string | null;
  url: string | null;
  enabled: boolean;
  source: SourceRaw;
}
