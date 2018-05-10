import { RawTimestamped } from '../../db';
import { Coordinate3d, NamedNode, Tag } from '../../ww-commons';
import { GaugeRaw } from '../gauges';
import { PointRaw } from '../points';
import { RegionRaw } from '../regions';
import { RiverRaw } from '../rivers';

export interface GaugeBindingRaw {
  minimum?: number;
  maximum?: number;
  optimum?: number;
  impossible?: number;
  approximate?: boolean;
}

interface ShapeRaw {
  type: string;
  coordinates: Coordinate3d[];
}

export interface SectionRaw extends NamedNode, RawTimestamped {
  alt_names: string[];

  river_id: string;
  river?: RiverRaw;
  gauge_id: string | null;
  gauge?: GaugeRaw;
  region_id: string;
  region?: RegionRaw;

  season_numeric: number[];
  levels: GaugeBindingRaw | null;
  flows: GaugeBindingRaw | null;
  shape: ShapeRaw;
  distance: number | null;
  drop: number | null;
  duration: number | null;
  difficulty: number;
  difficulty_xtra: string | null;
  rating: number | null;
  description: string | null;
  season: string | null;
  flows_text: string | null;
  put_in: string;
  take_out: string;

  pois: PointRaw[] | null;
  tags: Tag[] | null;

  count: number | null; // window function count
}

export interface SectionsFilter {
  riverId?: string;
  regionId?: string;
  updatedAfter?: Date;
}
