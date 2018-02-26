import { RawTimestamped } from '../../db';
import { NamedNode } from '../../ww-commons';
import { RegionRaw } from '../regions';

export interface RiverRaw extends NamedNode, RawTimestamped {
  region_id: string;
  region?: RegionRaw;
  alt_names: string[];
}
