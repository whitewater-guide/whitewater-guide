import { OnPressEvent } from '@react-native-mapbox-gl/maps';
import area from '@turf/area';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { Feature } from '@turf/helpers';
import square from '@turf/square';
import {
  BBox,
  ListedSectionFragment,
  useMapSelection,
} from '@whitewater-guide/clients';
import { PointCoreFragment } from '@whitewater-guide/schema';
import { MutableRefObject, useCallback } from 'react';

import theme from '../../../theme';
import { useCamera } from './useCamera';

const getSectionMiddle = (section: ListedSectionFragment): [number, number] => {
  const [pLng, pLat] = section.putIn.coordinates;
  const [tLng, tLat] = section.takeOut.coordinates;
  return [(pLng + tLng) / 2, (pLat + tLat) / 2];
};

const getFeature = (e: Feature | OnPressEvent) => {
  if ('features' in e) {
    if (e.features?.length) {
      return {
        id: e.features[0].id,
        geometry: e.features[0].geometry,
      };
    }
    return null;
  }
  return e.id ? { id: e.id, geometry: e.geometry } : null;
};

export const useSelectionHandler = (
  sections: ListedSectionFragment[],
  pois: PointCoreFragment[],
  sectionSelectable = true,
  visibleBounds: MutableRefObject<BBox>,
) => {
  const [_, onSelected] = useMapSelection();
  const camera = useCamera();
  const onPress = useCallback(
    (e: Feature | OnPressEvent) => {
      const feature = getFeature(e);
      if (!feature) {
        onSelected(null);
        return;
      }
      const { id, geometry } = feature;
      const { type } = geometry;
      const nodes: Array<ListedSectionFragment | PointCoreFragment> =
        type === 'LineString' ? sections : pois;
      const node = nodes.find((el) => el.id === id);
      if (node) {
        if (node.__typename === 'Section' && !sectionSelectable) {
          return;
        }
        onSelected(node);
        if (camera) {
          if (node.__typename === 'Section') {
            const [[maxLng, maxLat], [minLng, minLat]] = visibleBounds.current;
            const boundsArea = area(
              bboxPolygon([minLng, minLat, maxLng, maxLat]),
            );
            const squared = square(bbox(geometry));
            const sectionArea = area(bboxPolygon(squared));
            if (sectionArea < boundsArea) {
              camera.moveTo(getSectionMiddle(node), 300);
            } else {
              camera.fitBounds(
                [squared[2], squared[3]],
                [squared[0], squared[1]],
                theme.margin.single,
                2600,
              );
            }
          } else if (node.__typename === 'Point') {
            const [lng, lat] = node.coordinates;
            camera.moveTo([lng, lat], 300);
          }
        }
      } else {
        onSelected(null);
      }
    },
    [onSelected, sections, pois, camera, sectionSelectable, visibleBounds],
  );
  return onPress;
};
