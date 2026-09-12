import type { Coordinates } from '@/types/coordinates';

export type BBox = [[number, number], [number, number]];
export type BBoxFlat = [number, number, number, number];

export function arrayToLatLngString(coord?: Coordinates): string {
  if (!coord) {
    return '';
  }
  const [lng, lat] = coord;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function getBBox(bounds: Coordinates[], flat?: false): BBox;
export function getBBox(bounds: Coordinates[], flat?: true): BBoxFlat;
export function getBBox(
  bounds: Coordinates[],
  flat = false,
): BBox | BBoxFlat {
  const flatBox = bounds.reduce<BBoxFlat>(
    ([mnLng, mxLng, mnLat, mxLat], [lng, lat]) => [
      Math.min(mnLng, lng),
      Math.max(mxLng, lng),
      Math.min(mnLat, lat),
      Math.max(mxLat, lat),
    ],
    [bounds[0][0], bounds[0][0], bounds[0][1], bounds[0][1]],
  );
  if (flat) {
    return flatBox;
  }
  const [minLng, maxLng, minLat, maxLat] = flatBox;
  return [
    [maxLng, maxLat],
    [minLng, minLat],
  ];
}

export function ensureAltitude(coordinates: Coordinates): Coordinates;
export function ensureAltitude(coordinates: Coordinates[]): Coordinates[];
export function ensureAltitude(
  coordinates: Coordinates | Coordinates[],
): Coordinates | Coordinates[] {
  if (coordinates.length === 0) {
    return [];
  }
  if (Array.isArray(coordinates[0])) {
    return (coordinates as Coordinates[]).map(
      ([lng, lat, alt]) => [lng, lat, alt || 0] as Coordinates,
    );
  }
  const [lng, lat, alt] = coordinates as Coordinates;
  return [lng, lat, alt || 0];
}

export function arrowAzimuth(
  from: [number, number],
  to: [number, number],
): number {
  const lng1 = (from[0] * Math.PI) / 180;
  const lat1 = (from[1] * Math.PI) / 180;
  const lng2 = (to[0] * Math.PI) / 180;
  const lat2 = (to[1] * Math.PI) / 180;
  const dLng = lng2 - lng1;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return ((bearing + 360) % 360) - 90;
}

export function pointInClosedRing(
  lng: number,
  lat: number,
  ring: Coordinates[],
): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}
