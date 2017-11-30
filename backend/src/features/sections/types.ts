import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedNode, Tag } from '../../ww-commons';
import { PointRaw } from '../points/types';

export const SectionsSchema = loadGraphqlFile('sections');

export interface GaugeBindingRaw {
  minimum?: number;
  maximum?: number;
  optimum?: number;
  impossible?: number;
  approximate?: boolean;
}

export interface SectionRaw extends NamedNode, RawTimestamped {
  river_id: string;
  gauge_id: string | null;
  season_numeric: number[];
  levels: GaugeBindingRaw | null;
  flows: GaugeBindingRaw | null;
  shape: string;
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
