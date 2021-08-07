import { PointCoreFragment, Section } from '@whitewater-guide/schema';

import { ListedSectionFragment } from '../sections';

export type MapSection = ListedSectionFragment &
  Partial<Pick<Section, 'shape'>>;
export interface MapProps {
  sections: Array<MapSection>;
  pois: PointCoreFragment[];
  initialBounds: CodegenCoordinates[];
}
