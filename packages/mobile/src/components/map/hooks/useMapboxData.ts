import type { Feature, LineString, Point } from '@turf/helpers';
import type { MapProps } from '@whitewater-guide/clients';
import { poisToGeoJSON, sectionsToGeoJSON } from '@whitewater-guide/clients';
import { useMemo } from 'react';

interface MapboxData {
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
  sections: MapProps['sections'],
  pois?: MapProps['pois'],
  detailed?: boolean,
): MapboxData =>
  useMemo(() => {
    const sectionsJSON = sectionsToGeoJSON(sections, !!detailed);
    const arrows = sectionsJSON.features.map(sectionToArrowPoint);
    return {
      sections: sectionsJSON,
      pois: poisToGeoJSON(pois || []),
      arrows: { type: 'FeatureCollection', features: arrows },
    };
  }, [sections, pois, detailed]);
