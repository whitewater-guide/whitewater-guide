import { RawTimestamped } from '@db';
import { PointRaw } from '@features/points';
import { Coordinate3d, NamedNode } from '@ww-commons';

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
  premium: boolean;
  cover_image: {
    mobile?: string;
  };
  banners: {
    sectionDescriptionMobile?: string;
    sectionRowMobile?: string;
    sectionMediaMobile?: string;
    regionDescriptionMobile?: string;
    regionLoadingMobile?: string;
  };
}
