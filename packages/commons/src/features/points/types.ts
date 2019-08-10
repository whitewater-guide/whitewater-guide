import { Node } from '../../apollo';

export type Coordinate2d = [number, number];
export type Coordinate3d = [number, number, number];
export type Coordinate = Coordinate2d | Coordinate3d;

export interface Point extends Node {
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d;
  kind: string;
}

export interface PointInput {
  id: string | null;
  name?: string | null;
  description?: string | null;
  coordinates: Coordinate3d | null;
  kind: string;
}
