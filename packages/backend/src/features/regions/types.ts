import { RawTimestamped } from '../../db';
import { NamedNode } from '../../ww-commons/';
import { PointRaw } from '../points';

export interface RegionRaw extends NamedNode, RawTimestamped {
  description: string | null;
  season: string | null;
  season_numeric: number[];
  bounds: string | null;
  hidden: boolean | null;
  pois: PointRaw[] | null;
  count: number | null; // window function count
}
