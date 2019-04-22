import { Overwrite } from 'type-zoo';
import {
  Connection,
  NamedNode,
  TextSearchFilter,
  Timestamped,
} from '../../apollo';
import { Banner } from '../banners';
import { Gauge } from '../gauges';
import { Group } from '../groups';
import { Coordinate3d, Point, PointInput } from '../points';
import { River } from '../rivers';
import { Section } from '../sections';
import { Source } from '../sources';

export interface Region extends NamedNode, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]>;
  hidden: boolean | null;
  premium: boolean;
  hasPremiumAccess: boolean;
  editable: boolean;
  sku: string | null;
  coverImage: RegionCoverImage;
  pois: Point[];
  groups: Group[];
  // --- connections
  rivers?: Connection<River>;
  gauges?: Connection<Gauge>;
  sections?: Connection<Section>;
  sources?: Connection<Source>;
  mediaSummary?: RegionMediaSummary;
  banners?: Connection<Banner>;
}

export interface RegionInput {
  id: string | null;
  name: string;
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Coordinate3d[];
  pois: PointInput[];
}

export interface RegionAdminSettings {
  id: string;
  hidden: boolean;
  premium: boolean;
  sku: string | null;
  coverImage: RegionCoverImage;
}

export interface RegionCoverImage {
  __typename?: string;
  mobile: string | null;
}

export interface RegionMediaSummaryItem {
  count: number;
  size: number;
}

export interface RegionMediaSummary {
  photo: RegionMediaSummaryItem;
  video: RegionMediaSummaryItem;
  blog: RegionMediaSummaryItem;
}

export type RegionsFilter = TextSearchFilter;

export type RegionFormInput<RichText> = Overwrite<
  RegionInput,
  { description: RichText }
>;
