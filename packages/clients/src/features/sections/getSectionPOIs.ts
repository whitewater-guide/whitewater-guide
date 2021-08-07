import {
  PointCoreFragment,
  Section,
  SectionPoIsFragment,
} from '@whitewater-guide/schema';

export function getSectionPOIs(
  section: Partial<Pick<Section, 'gauge'> & SectionPoIsFragment> | null,
  gaugeI18n = 'Gauge',
): PointCoreFragment[] {
  if (!section?.pois) {
    return [];
  }
  const pois = [...section.pois];
  const gaugePOI = section.gauge?.location;
  if (gaugePOI) {
    pois.push({ ...gaugePOI, name: `${gaugeI18n} ${section.gauge?.name}` });
  }
  return pois;
}
