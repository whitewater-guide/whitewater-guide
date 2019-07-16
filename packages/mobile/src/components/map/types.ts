import { Coordinate2d } from '@whitewater-guide/commons';

export interface MapboxBounds {
  ne: Coordinate2d;
  sw: Coordinate2d;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}
