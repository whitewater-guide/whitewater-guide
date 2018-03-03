import { NamedNode, Node, Timestamped } from '../../core';
import { Gauge } from '../gauges';
import { Coordinate3d, Point, PointInput } from '../points';
import { Region } from '../regions';
import { River } from '../rivers';
import { SelectableTagInput, Tag } from '../tags';

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
  minimum: number | null;
  optimum: number | null;
  maximum: number | null;
  impossible: number | null;
  approximate: boolean | null;
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

  tags: Tag[];

  // media: Media[];
  pois: Point[];
}

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

  shape: Coordinate3d[] | null;
  distance: number | null;
  drop: number | null;
  duration: number | null;
  difficulty: number;
  difficultyXtra: string | null;
  rating: number | null;
  tags: Node[];
  pois: PointInput[];
}

export interface SectionSearchTerms {
  sortBy: 'name' | 'difficulty' | 'duration' | 'rating';
  sortDirection: 'ASC' | 'DESC';
  searchString: '';
  difficulty: [number, number];
  duration: [Duration, Duration];
  rating: number;
  seasonNumeric: [number, number];
}

export interface SectionSearchTermInput extends SectionSearchTerms {
  regionId?: string;

  supplyTags?: SelectableTagInput[];
  kayakingTags?: SelectableTagInput[];
  hazardsTags?: SelectableTagInput[];
  miscTags?: SelectableTagInput[];
}

export const DefaultSectionSearchTerms: SectionSearchTerms = {
  sortBy: 'name',
  sortDirection: 'ASC',
  searchString: '',
  difficulty: [1, 6],
  duration: [Duration.LAPS, Duration.MULTIDAY],
  rating: 0,
  seasonNumeric: [0, 23],
};
