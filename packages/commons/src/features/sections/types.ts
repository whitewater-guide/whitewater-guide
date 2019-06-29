import { Connection, NamedNode, Node, Timestamped } from '../../apollo';
import { Overwrite } from '../../utils';
import { Gauge } from '../gauges';
import { Media } from '../media';
import { Coordinate3d, Point, PointInput } from '../points';
import { Region } from '../regions';
import { River } from '../rivers';
import { Tag, TagInput } from '../tags';
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
  minimum?: number | null;
  optimum?: number | null;
  maximum?: number | null;
  impossible?: number | null;
  approximate?: boolean | null;
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
  demo: boolean;

  tags: Tag[];

  pois: Point[];

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

  river: Node;
  gauge: Node | null;
  levels: GaugeBinding | null;
  flows: GaugeBinding | null;
  flowsText: string | null;

  shape: Coordinate3d[];
  distance: number | null;
  drop: number | null;
  duration: number | null;
  difficulty: number;
  difficultyXtra: string | null;
  rating: number | null;
  tags: Node[];
  pois: PointInput[];

  hidden: boolean;
}

export type SectionSortBy = 'name' | 'difficulty' | 'duration' | 'rating';

export interface SectionSearchTerms {
  sortBy: SectionSortBy;
  sortDirection: 'ASC' | 'DESC';
  searchString: '';
  difficulty: [number, number];
  duration: [Duration, Duration];
  rating: number;
  seasonNumeric: [number, number];
  withTags: string[];
  withoutTags: string[];
}

export const DefaultSectionSearchTerms: SectionSearchTerms = {
  sortBy: 'name',
  sortDirection: 'ASC',
  searchString: '',
  difficulty: [1, 6],
  duration: [Duration.LAPS, Duration.MULTIDAY],
  rating: 0,
  seasonNumeric: [0, 23],
  withTags: [],
  withoutTags: [],
};

export interface SectionAdminSettings {
  demo: boolean;
}

export interface SectionsFilter {
  riverId?: string;
  regionId?: string;
  updatedAfter?: Date;
}

interface FormOverrides<RichText = any> {
  description: RichText;
  river: NamedNode;
}

export type SectionFormInput<RichText> = Overwrite<
  Omit<SectionInput, 'tags'>,
  FormOverrides<RichText>
> & {
  kayakingTags: TagInput[];
  hazardsTags: TagInput[];
  supplyTags: TagInput[];
  miscTags: TagInput[];
};

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
  diff: null | object;
}

export interface SectionsEditLogFilter {
  regionId?: string;
  editorId?: string;
}
