import isNil from 'lodash/isNil';
import { Node } from '../../apollo';
import { Coordinate, Coordinate3d, Point } from './types';

export function isCoordinate(value: any): value is Coordinate {
  return Array.isArray(value) && value.every((i) => typeof i === 'number');
}

export const isNilCoordinates = (coordinates?: any[] | null): boolean => {
  return isNil(coordinates) || coordinates.every(isNil);
};

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

export const isPoint = (node?: Node | null): node is Point =>
  !!node && node.__typename === 'Point';
