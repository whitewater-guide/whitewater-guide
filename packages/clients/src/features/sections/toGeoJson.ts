import bearing from '@turf/bearing';
import {
  bearingToAzimuth,
  Feature,
  FeatureCollection,
  LineString,
} from '@turf/helpers';
import { Section } from '@whitewater-guide/schema';

import { getSectionColor } from './getSectionColor';
import { ListedSectionFragment } from './listSections.generated';
import { sectionName } from './sectionName';

const removeAlt = ([lng, lat]: CodegenCoordinates): [number, number] => [
  lng,
  lat,
];

interface Props {
  color: string;
  approximate: boolean;
  arrowAzimuth: number;
  name?: string;
}

export function sectionToGeoJSON(
  section: ListedSectionFragment & Partial<Pick<Section, 'shape'>>,
  detailed?: boolean,
): Feature<LineString, Props> {
  const { id, shape, putIn, takeOut, levels, flows } = section;
  const coordinates =
    detailed && !!shape
      ? shape.map(removeAlt)
      : [removeAlt(putIn.coordinates), removeAlt(takeOut.coordinates)];
  const approximate =
    (!!flows && flows.approximate) || (!!levels && levels.approximate);

  const arrowAzimuth =
    bearingToAzimuth(
      bearing(
        coordinates[coordinates.length - 2],
        coordinates[coordinates.length - 1],
      ),
    ) - 90;

  return {
    id,
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      color: getSectionColor(section),
      approximate: !!approximate,
      arrowAzimuth,
      name: sectionName(section),
    },
  };
}

export function sectionsToGeoJSON(
  sections: Array<ListedSectionFragment & Partial<Pick<Section, 'shape'>>>,
  detailed?: boolean,
): FeatureCollection<LineString, Props> {
  return {
    type: 'FeatureCollection',
    features: sections.map((s) => sectionToGeoJSON(s, detailed)),
  };
}
