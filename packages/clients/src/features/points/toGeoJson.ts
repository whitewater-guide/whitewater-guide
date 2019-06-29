import { Feature, FeatureCollection, Point as TurfPoint } from '@turf/helpers';
import { Point } from '@whitewater-guide/commons';

type Props = Pick<Point, 'kind'>;

export const poiToGeoJSON = ({
  id,
  coordinates,
  kind,
}: Point): Feature<TurfPoint, Props> => {
  return {
    id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinates[0], coordinates[1]],
    },
    properties: {
      kind,
    },
  };
};

export const poisToGeoJSON = (
  pois: Point[],
): FeatureCollection<TurfPoint, Props> => ({
  type: 'FeatureCollection',
  features: pois.map(poiToGeoJSON),
});
