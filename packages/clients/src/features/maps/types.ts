import { CoordinateLoose, Point, Section } from '@whitewater-guide/commons';

export interface MapProps {
  sections: Section[];
  pois: Point[];
  initialBounds: CoordinateLoose[];
}
