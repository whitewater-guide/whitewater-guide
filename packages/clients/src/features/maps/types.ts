import { PointCoreFragment, Section } from '@whitewater-guide/schema';

import { ListedSectionFragment } from '../sections';

export interface MapProps {
  sections: Array<ListedSectionFragment & Partial<Pick<Section, 'shape'>>>;
  pois: PointCoreFragment[];
  initialBounds: CodegenCoordinates[];
}
