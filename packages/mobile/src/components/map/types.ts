import { Coordinate2d, CoordinateLoose } from '@whitewater-guide/commons';

export interface MapboxBounds {
  ne: Coordinate2d;
  sw: Coordinate2d;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface MapViewProps {
  mapType: string;
  detailed?: boolean;
  locationPermissionGranted: boolean;
  initialBounds: CoordinateLoose[];
  testID?: string;
}
