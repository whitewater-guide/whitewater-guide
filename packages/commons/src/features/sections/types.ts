import {
  Connection,
  NamedNode,
  Node,
  NodeRef,
  SearchableFilterOptions,
  Timestamped,
} from '../../apollo';
import { Gauge } from '../gauges';
import { Media, MediaInput } from '../media';
import { CoordinateLoose, Point, PointInput } from '../points';
import { Region } from '../regions';
import { River } from '../rivers';
import { Tag } from '../tags';
import { User } from '../users';

export enum Duration {
  LAPS = 10,
  TWICE = 20,
  DAYRUN = 30,
  OVERNIGHTER = 40,
  MULTIDAY = 50,
}

export const Durations = new Map<number, string>();
Durations.set(Duration.LAPS, 'laps');
Durations.set(Duration.TWICE, 'twice');
Durations.set(Duration.DAYRUN, 'full day');
Durations.set(Duration.OVERNIGHTER, 'overnighter');
Durations.set(Duration.MULTIDAY, 'multiday');

Durations.entries();

export interface GaugeBinding {
  __typename?: 'GaugeBinding';
  minimum?: number | null;
  optimum?: number | null;
  maximum?: number | null;
  impossible?: number | null;
  approximate?: boolean | null;
  formula?: string | null;
}

export interface Section extends NamedNode, Timestamped {
  altNames: string[];

  description: string | null;
  season: string | null;
  seasonNumeric: number[];

  region: Region;
  river: River;

  gauge: Gauge | null;
  levels: GaugeBinding | null;
  flows: GaugeBinding | null;
  flowsText: string | null;

  putIn: Point;
  takeOut: Point;
  shape: Array<[number, number, number]>;
  distance: number | null;
  drop: number | null;
  duration: Duration | null;
  difficulty: number;
  difficultyXtra: string | null;
  rating: number | null;
  hidden: boolean;
  helpNeeded: string | null;
  demo: boolean;
  verified?: boolean | null;

  tags: Tag[];
  pois: Point[];

  createdBy?: User | null;

  // --- connections
  media?: Connection<Media>;
}

export const isSection = (node?: Node | null): node is Section =>
  !!node && node.__typename === 'Section';

export interface SectionInput {
  id: string | null;
  name: string;
  altNames: string[] | null;
  description: string | null;
  season: string | null;
  seasonNumeric: number[];

  river: NodeRef;
  gauge: NodeRef | null;
  region?: NodeRef | null;
  levels: GaugeBinding | null;
  flows: GaugeBinding | null;
  flowsText: string | null;

  shape: CoordinateLoose[];
  distance: number | null;
  drop: number | null;
  duration: number | null;
  difficulty: number;
  difficultyXtra: string | null;
  rating: number | null;
  tags: NodeRef[];
  pois: PointInput[];
  media: MediaInput[];

  hidden: boolean;
  helpNeeded: string | null;

  createdBy?: string | null;
  importId?: string | null;
}

export type SectionSortBy = 'name' | 'difficulty' | 'duration' | 'rating';

// This is cleint-side filter options
export interface SectionFilterOptions extends SearchableFilterOptions {
  sortBy: SectionSortBy;
  sortDirection: 'ASC' | 'DESC';
  difficulty: [number, number];
  duration: [Duration, Duration];
  rating: number;
  seasonNumeric: [number, number];
  withTags: string[];
  withoutTags: string[];
}

export const DefaultSectionFilterOptions: SectionFilterOptions = {
  sortBy: 'name',
  sortDirection: 'ASC',
  searchString: '',
  difficulty: [0, 6],
  duration: [Duration.LAPS, Duration.MULTIDAY],
  rating: 0,
  seasonNumeric: [0, 23],
  withTags: [],
  withoutTags: [],
};

// This is server-side filter options
export interface SectionsFilter {
  riverId?: string;
  regionId?: string;
  updatedAfter?: Date;
  search?: string;
  verified?: boolean | null;
  editable?: boolean | null;
}

export interface SectionAdminSettings {
  demo: boolean;
}

export type SectionEditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'media_create'
  | 'media_delete'
  | 'media_update';

export interface SectionEditLogEntry extends Node {
  section: Section;
  editor: User;
  action: SectionEditAction;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  diff: null | object;
}

export interface SectionsEditLogFilter {
  regionId?: string;
  editorId?: string;
}
