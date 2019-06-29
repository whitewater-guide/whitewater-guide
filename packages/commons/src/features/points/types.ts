import { Node } from '../../apollo';

export type Coordinate2d = [number, number];
export type Coordinate3d = [number, number, number];
export type Coordinate = Coordinate2d | Coordinate3d;

function isCoordinate(value: any): value is Coordinate {
  return Array.isArray(value) && value.every((i) => typeof i === 'number');
}

export function withZeroAlt(coordinates: Coordinate): Coordinate3d;
export function withZeroAlt(coordinates: Coordinate[]): Coordinate3d[];
export function withZeroAlt(coordinates: any): any {
  if (isCoordinate(coordinates)) {
    const [ln, la, al] = coordinates as any;
    return [ln, la, al || 0] as Coordinate3d;
  } else {
    return coordinates.map(
      ([lng, lat, alt]: any) => [lng, lat, alt || 0] as Coordinate3d,
    );
  }
}

export interface Point extends Node {
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d;
  kind: string;
}

export const isPoint = (node?: Node | null): node is Point =>
  !!node && node.__typename === 'Point';

export interface PointInput {
  id: string | null;
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d | null;
  kind: string;
}
