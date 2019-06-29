import { Coordinate3d, Point, Section } from '@whitewater-guide/commons';

export interface MapProps {
  sections: Section[];
  pois: Point[];
  initialBounds: Coordinate3d[];
}
