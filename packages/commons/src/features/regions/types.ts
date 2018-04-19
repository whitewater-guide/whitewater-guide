import { NamedNode, Timestamped } from '../../core';
import { Gauge } from '../gauges';
import { Group } from '../groups';
import { Coordinate3d, Point, PointInput } from '../points';
import { River } from '../rivers';
import { Section } from '../sections';
import { Connection } from '../types';

export interface Region extends NamedNode, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]> | null;
  hidden: boolean | null;
  premium: boolean;
  editable: boolean;
  sku: string | null;
  pois: Point[];
  groups: Group[];
  // --- connections
  rivers?: Connection<River>;
  gauges?: Connection<Gauge>;
  sections?: Connection<Section>;
}

export class RegionInput {
  id: string | null;
  name: string;
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Coordinate3d[] | null;
  pois: PointInput[];
}

export interface RegionAdminSettings {
  hidden: boolean;
  premium: boolean;
  sku: string | null;
}
