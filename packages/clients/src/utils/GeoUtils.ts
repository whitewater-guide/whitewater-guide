import { isNumber, take } from 'lodash';
import { Coordinate, Coordinate2d } from '../../ww-commons/features/points';
type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;

const EARTH_RADIUS_KM = 6378.137;

export function gmapsToArray(latLng?: LatLng | LatLngLiteral | null): Coordinate2d | null {
  if (!latLng) {
    return null;
  }
  const { lat, lng } = latLng;
  const latitude: number = typeof lat === 'number' ? lat : lat();
  const longitude: number = typeof lng === 'number' ? lng : lng();
  return [longitude, latitude];
}

export function arrayToGmaps(array?: Coordinate | null): LatLngLiteral | null {
  if (!array) {
    return null;
  }
  const [lng, lat] = array;
  return { lat, lng };
}

export function isValidLat(lat: any): boolean {
  return isNumber(lat) && lat >= -90 && lat <= 90;
}

export function isValidLng(lng: any): boolean {
  return isNumber(lng) && lng >= -180 && lng <= 180;
}

// tslint:disable-next-line:no-inferrable-types
export function arrayToDMSString(coordinates: Coordinate, pretty: boolean = true): string {
  const truncate = (n: number) => (n > 0 ? Math.floor(n) : Math.ceil(n));
  const latHemisphere = coordinates[1] < 0 ? 'S' : 'N';
  const lonHemisphere = coordinates[0] < 0 ? 'W' : 'E';
  const hemispheres = [lonHemisphere, latHemisphere];
  return take(coordinates, 2).map((dd: number, i: number) => {
    const absDD = Math.abs(dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    let seconds = (absDD - degrees - (minutes / 60)) * 3600;
    if (pretty) {
      seconds = truncate(seconds);
    }
    return `${degrees}°${minutes}′${seconds}″ ${hemispheres[i]}`;
  }).reverse().join(', ');
}

/**
 * Compute distance between two points in kms using https://en.wikipedia.org/wiki/Haversine_formula
 * @param a Point in [lng, lat] format
 * @param b Point in [lng, lat] format
 * @returns Distance in km
 */
export function computeDistanceBetween(a: Coordinate, b: Coordinate): number {
  const [aLng, aLat] = a.map(coord => coord * Math.PI / 180);
  const [bLng, bLat] = b.map(coord => coord * Math.PI / 180);
  const dLat2 = (aLat - bLat) / 2;
  const dLng2 = (aLng - bLng) / 2;
  const hav = Math.pow(Math.sin(dLat2), 2) + Math.cos(aLat) * Math.cos(bLat) * (Math.pow(Math.sin(dLng2), 2));
  return 2 * EARTH_RADIUS_KM * Math.asin(
    Math.sqrt(hav),
  );
}

export type BBox = [number, number, number, number];

/**
 * Get bounding box for array of [lng, lat] pairs
 * @param bounds
 * @returns [minLng, maxLng, minLat, maxLat]
 */
export function getBBox(bounds: Coordinate[]): BBox {
  return bounds.reduce<BBox>(
    ([mnLng, mxLng, mnLat, mxLat], [lng, lat]) => [
      Math.min(mnLng, lng),
      Math.max(mxLng, lng),
      Math.min(mnLat, lat),
      Math.max(mxLat, lat),
    ],
    [bounds[0][0], bounds[0][0], bounds[0][1], bounds[0][1]],
  );
}

export function getBoundsDeltaRegion(bounds: Coordinate[] | null | undefined) {
  if (!bounds) {
    return undefined;
  }
  const [minLng, maxLng, minLat, maxLat] = getBBox(bounds);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.abs(maxLat - minLat) / 2,
    longitudeDelta: Math.abs(maxLng - minLng) / 2,
  };
}

function latRad(lat: number) {
  const sin = Math.sin(lat * Math.PI / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx: number, worldPx: number, fraction: number) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}

/**
 * Computes google map zoom level, given bounds and map size
 * http://stackoverflow.com/a/13274361/6212547
 * @param bounds - array of [lng, lat] arrays
 * @param mapDim {width, height} of map in pixels
 * @returns {number} Integer zoom level
 */
export function getBoundsZoomLevel(bounds: Coordinate[] = [], mapDim: { width: number, height: number }) {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  const [minLng, maxLng, minLat, maxLat] = getBBox(bounds);

  const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;

  const lngDiff = maxLng - minLng;
  const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

  const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

/**
 * Compares 2 arrays of [lng, lat] pairs and return patch in `immutability-helper` $splice format
 * @param prev Old value
 * @param next New value
 * @returns {*}
 */
export function getCoordinatesPatch(prev: Coordinate2d[], next: Coordinate2d[]): any[] | null {
  const delta = next.length - prev.length;
  const delCount = delta > 0 ? 0 : 1;
  const min = Math.min(prev.length, next.length);
  for (let i = 0; i < min; i += 1) {
    if (prev[i][0] !== next[i][0] || prev[i][1] !== next[i][1]) {
      const patch: any[] = [i, delCount];
      if (delta >= 0) {
        patch.push([next[i][0], next[i][1]]);
      }
      return patch;
    }
  }
  if (delta > 0) { // Insert in the end
    return [prev.length, 0, next[next.length - 1]];
  } else if (delta < 0) { // Delete the last
    return [next.length, 1];
  }
  return null;
}

export interface LatitudeLongitude {
  latitude: number;
  longitude: number;
}

export function computeOffset({ latitude, longitude }: LatitudeLongitude, distance: number, heading: number) {
  const distanceNorm = distance / EARTH_RADIUS_KM;
  const headingRad = Math.PI * heading / 180;
  const fromLat = Math.PI * latitude / 180;
  const fromLng = Math.PI * longitude / 180;
  const cosDistance = Math.cos(distanceNorm);
  const sinDistance = Math.sin(distanceNorm);
  const sinFromLat = Math.sin(fromLat);
  const cosFromLat = Math.cos(fromLat);
  const sinLat = cosDistance * sinFromLat + sinDistance * cosFromLat * Math.cos(headingRad);
  const dLng = Math.atan2(
    sinDistance * cosFromLat * Math.sin(headingRad),
    cosDistance - sinFromLat * sinLat,
  );
  return { latitude: 180 * Math.asin(sinLat) / Math.PI, longitude: 180 * (fromLng + dLng) / Math.PI };
}
