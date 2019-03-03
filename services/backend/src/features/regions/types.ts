import { RawTimestamped } from '@db';
import { PointRaw } from '@features/points';
import { Coordinate3d, NamedNode } from '@whitewater-guide/commons';

interface BoundsGeoJson {
  type: 'Polygon';
  coordinates: Coordinate3d[][];
}

export interface CoverImageRaw {
  mobile?: string | null;
}

export interface RegionRaw extends NamedNode, RawTimestamped {
  description: string | null;
  season: string | null;
  season_numeric: number[];
  bounds: BoundsGeoJson;
  hidden: boolean | null;
  pois: PointRaw[] | null;
  editable?: boolean; // computed column, not necessary present in db response
  premium: boolean;
  cover_image: CoverImageRaw;
}

export interface CoverArgs {
  width?: number;
}
