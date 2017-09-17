import { GrapqhlResource, Timestamped } from '../../core';
import { Coordinate, Point, PointInput } from '../points';

export interface Region extends GrapqhlResource, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]> | null;
  hidden: boolean | null;
  riversCount: number;
  sectionsCount: number;
  pois: Point[];
}

export class RegionInput {
  id: string | null;
  name: string;
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds?: Coordinate[];
  hidden: boolean;
  pois: PointInput[];
}
