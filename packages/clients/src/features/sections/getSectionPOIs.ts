import { Point, Section } from '@whitewater-guide/commons';

export const getSectionPOIs = (
  section: Section | null,
  gaugeI18n = 'Gauge',
): Point[] => {
  if (!section) {
    return [];
  }
  const pois = [...section.pois];
  const gaugePOI = section.gauge && section.gauge.location;
  if (gaugePOI) {
    pois.push({ ...gaugePOI, name: `${gaugeI18n} ${section.gauge?.name}` });
  }
  return pois;
};
