import { Coordinate3d, Section } from '@whitewater-guide/commons';

import { getSectionPOIs } from './getSectionPOIs';

export const getSectionContentBounds = (
  section: Section | null,
): Coordinate3d[] | null => {
  if (!section) {
    return null;
  }
  const pois = getSectionPOIs(section);
  return section.shape.concat(pois.map((poi) => poi.coordinates));
};
