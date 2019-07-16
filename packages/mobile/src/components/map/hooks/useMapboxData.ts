import { Feature, LineString, Point } from '@turf/helpers';
import {
  getBBox,
  MapProps,
  poisToGeoJSON,
  sectionsToGeoJSON,
} from '@whitewater-guide/clients';
import { useMemo } from 'react';
import theme from '../../../theme';
import { MapboxBounds } from '../types';

interface MapboxData {
  defaultSettings: { bounds: MapboxBounds };
  sections: any;
  pois: any;
  arrows: any;
}

const sectionToArrowPoint = (section: Feature<LineString>): Feature<Point> => {
  const takeOut =
    section.geometry.coordinates[section.geometry.coordinates.length - 1];
  return {
    type: 'Feature',
    geometry: {
      coordinates: [...takeOut],
      type: 'Point',
    },
    id: section.id,
    properties: { ...section.properties },
  };
};

export const useMapboxData = (
  props: MapProps,
  detailed?: boolean,
): MapboxData =>
  useMemo(() => {
    const { sections, pois, initialBounds } = props;
    const [ne, sw] = getBBox(initialBounds);
    const bounds: MapboxBounds = {
      ne,
      sw,
      paddingBottom: theme.margin.single,
      paddingLeft: theme.margin.single,
      paddingRight: theme.margin.single,
      paddingTop: theme.margin.single,
    };
    const sectionsJSON = sectionsToGeoJSON(sections, !!detailed);
    const arrows = sectionsJSON.features.map(sectionToArrowPoint);
    return {
      defaultSettings: { bounds },
      sections: sectionsJSON,
      pois: poisToGeoJSON(pois),
      arrows: { type: 'FeatureCollection', features: arrows },
    };
  }, [props]);
