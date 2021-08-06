import { Section, SectionPoIsFragment } from '@whitewater-guide/schema';

import { getSectionPOIs } from './getSectionPOIs';

export const getSectionContentBounds = (
  section?: (Pick<Section, 'shape'> & SectionPoIsFragment) | null,
): CodegenCoordinates[] | null => {
  if (!section) {
    return null;
  }
  const pois = getSectionPOIs(section);
  return section.shape.concat(pois.map((poi) => poi.coordinates));
};
