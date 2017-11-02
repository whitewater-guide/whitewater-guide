import { NamedNode, Timestamped } from '../../core';
import { Coordinate3d, Point, PointInput } from '../points';
import { River } from '../rivers';
import { Connection } from '../types';
import { Gauge } from '../gauges';

export interface Region extends NamedNode, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]> | null;
  hidden: boolean | null;
  pois: Point[];
  // --- connections
  rivers?: Connection<River>;
  gauges?: Connection<Gauge>;
}

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
