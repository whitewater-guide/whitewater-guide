import { RawTimestamped } from '@db';
import { PointRaw } from '@features/points';
import {
  Coordinate3d,
  NamedNode,
  SectionEditAction,
  Tag,
} from '@whitewater-guide/commons';

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
  river_name: string; // for embedding
  gauge_id: string | null;
  region_id: string;
  region_name: string; // for embedding

  hidden: boolean;
  demo: boolean;
  premium: boolean;

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

export interface SectionsEditLogRaw {
  id?: string; // optional for input
  section_id: string;
  old_section_name: string;
  new_section_name: string;
  river_id: string;
  river_name: string;
  region_id: string;
  region_name: string;
  editor_id: string;
  editor_name: string;
  action: SectionEditAction;
  created_at: Date;
}
