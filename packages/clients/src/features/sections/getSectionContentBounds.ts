import { Section, SectionPoIsFragment } from '@whitewater-guide/schema';

import { getSectionPOIs } from './getSectionPOIs';

export function getSectionContentBounds(
  section?: Partial<Pick<Section, 'shape'> & SectionPoIsFragment> | null,
): CodegenCoordinates[] | null {
  if (!section?.shape) {
    return null;
  }
  const pois = getSectionPOIs(section);
  return section.shape.concat(pois.map((poi) => poi.coordinates));
}
