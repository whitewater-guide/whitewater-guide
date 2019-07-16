import { Coordinate } from '@whitewater-guide/commons';
import { EARTH_RADIUS_KM } from './constants';

/**
 * Compute distance between two points in kms using https://en.wikipedia.org/wiki/Haversine_formula
 * @param a Point in [lng, lat] format
 * @param b Point in [lng, lat] format
 * @returns Distance in km
 */
export function computeDistanceBetween(a: Coordinate, b: Coordinate): number {
  const [aLng, aLat] = a.map((coord) => (coord * Math.PI) / 180);
  const [bLng, bLat] = b.map((coord) => (coord * Math.PI) / 180);
  const dLat2 = (aLat - bLat) / 2;
  const dLng2 = (aLng - bLng) / 2;
  const hav =
    Math.pow(Math.sin(dLat2), 2) +
    Math.cos(aLat) * Math.cos(bLat) * Math.pow(Math.sin(dLng2), 2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(hav));
}
