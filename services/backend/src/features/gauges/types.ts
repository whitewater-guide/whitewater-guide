import { WithLanguage } from '~/apollo';
import { RawTimestamped } from '~/db';
import { PointRaw } from '~/features/points';
import { NamedNode } from '@whitewater-guide/commons';

export interface GaugeRaw extends NamedNode, RawTimestamped, WithLanguage {
  code: string;
  script: string;
  level_unit: string | null;
  flow_unit: string | null;
  request_params: any;
  url: string | null;
  enabled: boolean;

  // Foreign keys
  source_id: string;
  location_id: string;

  // Embedded connections
  location: PointRaw;
}
