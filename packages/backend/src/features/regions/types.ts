import { RawTimestamped } from '../../db';
import { Coordinate3d } from '../../ww-commons';
import { NamedNode } from '../../ww-commons/';
import { PointRaw } from '../points';

interface BoundsGeoJson {
  type: string;
  coordinates: Coordinate3d[][];
}

export interface RegionRaw extends NamedNode, RawTimestamped {
  description: string | null;
  season: string | null;
  season_numeric: number[];
  bounds: BoundsGeoJson | null;
  hidden: boolean | null;
  pois: PointRaw[] | null;
  count: number | null; // window function count
  editable?: boolean; // computed column, not necessary present in db response
}
