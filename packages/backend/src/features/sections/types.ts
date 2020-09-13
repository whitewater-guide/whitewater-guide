import {
  Coordinate3d,
  NamedNode,
  SectionEditAction,
  Tag,
} from '@whitewater-guide/commons';

import { RawTimestamped } from '~/db';
import { PointRaw } from '~/features/points';

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
  language: string;

  alt_names: string[];

  river_id: string;
  river_name: string; // for embedding
  gauge_id: string | null;
  region_id: string;
  region_name: string; // for embedding

  hidden: boolean;
  demo: boolean;
  premium: boolean;
  verified: boolean | null;
  help_needed: string | null;

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

  created_by: string | null;
}

export interface SectionsEditLogRaw {
  id?: string; // optional for input
  section_id: string;
  section_name: string;
  river_id: string;
  river_name: string;
  region_id: string;
  region_name: string;
  editor_id: string;
  editor_name: string;
  action: SectionEditAction;
  diff?: any;
  created_at: Date;
  count?: number;
}

// [SectionRaw, upsertedMediaIds, deletedMediaIds]
export type RawSectionUpsertResult =
  | undefined
  | [SectionRaw, string[] | null, string[] | null];
