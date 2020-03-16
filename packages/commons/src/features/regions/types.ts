import {
  Connection,
  NamedNode,
  Node,
  SearchableFilterOptions,
  Timestamped,
} from '../../apollo';
import { Banner } from '../banners';
import { Gauge } from '../gauges';
import { Group } from '../groups';
import { CoordinateLoose, Point, PointInput } from '../points';
import { River } from '../rivers';
import { Section } from '../sections';
import { Source } from '../sources';

export interface Region extends NamedNode, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]>;
  hidden: boolean | null;
  mapsSize?: number;
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
  bounds: CoordinateLoose[];
  pois: PointInput[];
}

export interface RegionAdminSettings {
  id: string;
  hidden: boolean;
  premium: boolean;
  sku: string | null;
  coverImage: RegionCoverImage;
  mapsSize: number;
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
  maps: RegionMediaSummaryItem;
}

export type RegionFilterOptions = SearchableFilterOptions;

export const DefaultRegionFilterOptions: RegionFilterOptions = {
  searchString: '',
};

export const isRegion = (node?: Node | null): node is Region =>
  !!node && node.__typename === 'Region';
