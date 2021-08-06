import { Coordinate3d } from './types';

export function ensureAltitude(coordinates: CodegenCoordinates): Coordinate3d;
export function ensureAltitude(
  coordinates: CodegenCoordinates[],
): Coordinate3d[];
export function ensureAltitude(coordinates: any): any {
  if (!coordinates.length) {
    return [];
  }
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(
      ([lng, lat, alt]: any) => [lng, lat, alt || 0] as Coordinate3d,
    );
  } else {
    const [ln, la, al] = coordinates;
    return [ln, la, al || 0] as Coordinate3d;
  }
}
