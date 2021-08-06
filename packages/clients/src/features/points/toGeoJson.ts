import { Feature, FeatureCollection, Point as TurfPoint } from '@turf/helpers';
import { Point, PointCoreFragment } from '@whitewater-guide/schema';

type Props = Pick<Point, 'kind'>;

export const poiToGeoJSON = ({
  id,
  coordinates,
  kind,
}: PointCoreFragment): Feature<TurfPoint, Props> => ({
  id,
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [coordinates[0], coordinates[1]],
  },
  properties: {
    kind,
  },
});

export const poisToGeoJSON = (
  pois: PointCoreFragment[],
): FeatureCollection<TurfPoint, Props> => ({
  type: 'FeatureCollection',
  features: pois.map(poiToGeoJSON),
});
