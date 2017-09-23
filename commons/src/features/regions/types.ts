import { GrapqhlResource, Timestamped } from '../../core';
import { Omit } from '../../ts';
import { Point, PointInput } from '../points';
import { Coordinate3d } from '../points/types';

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

export type RegionDetails = Omit<Region, 'riversCount' | 'sectionsCount'>;

export class RegionInput {
  id: string | null;
  name: string;
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Coordinate3d[] | null;
  hidden: boolean;
  pois: PointInput[];
}
