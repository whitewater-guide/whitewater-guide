export type Coordinate2d = [number, number];
export type Coordinate3d = [number, number, number];
export type Coordinate = Coordinate2d | Coordinate3d;

export function withZeroAlt(coordinates: Coordinate2d[]): Coordinate3d[] {
  return coordinates.map(([lng, lat]) => ([lng, lat, 0] as Coordinate3d));
}

export interface Point {
  id: string;
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d;
  kind: string;
}

export interface PointInput {
  id: string | null;
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d;
  kind: string;
}
