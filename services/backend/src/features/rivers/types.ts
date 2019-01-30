import { RawTimestamped } from '@db';
import { RegionRaw } from '@features/regions';
import { NamedNode } from '@whitewater-guide/commons';

export interface RiverRaw extends NamedNode, RawTimestamped {
  region_id: string;
  region?: RegionRaw;
  alt_names: string[];
}
