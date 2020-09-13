import bearing from '@turf/bearing';
import {
  bearingToAzimuth,
  Feature,
  FeatureCollection,
  LineString,
} from '@turf/helpers';
import {
  Coordinate2d,
  CoordinateLoose,
  Section,
  sectionName,
} from '@whitewater-guide/commons';

import { getSectionColor } from './getSectionColor';

const removeAlt = ([lng, lat]: CoordinateLoose): Coordinate2d => [lng, lat];

interface Props {
  color: string;
  approximate: boolean;
  arrowAzimuth: number;
  name?: string;
}

export const sectionToGeoJSON = (
  section: Section,
  detailed?: boolean,
): Feature<LineString, Props> => {
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
};

export const sectionsToGeoJSON = (
  sections: Section[],
  detailed?: boolean,
): FeatureCollection<LineString, Props> => ({
  type: 'FeatureCollection',
  features: sections.map((s) => sectionToGeoJSON(s, detailed)),
});
