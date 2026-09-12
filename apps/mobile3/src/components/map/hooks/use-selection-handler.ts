import type { PointCoreFragment } from '@whitewater-guide/schema';
import type { MutableRefObject } from 'react';
import { useCallback } from 'react';

import { useMapSelection } from '../map-selection';
import type { MapSection } from '../types';
import { useCamera } from './use-camera';

import type { BBox } from '@/utils/geo';

export interface OnPressEvent {
  features: GeoJSON.Feature[];
  coordinates: { latitude: number; longitude: number };
  point: { x: number; y: number };
}

export interface PressedFeature {
  id: GeoJSON.Feature['id'];
  geometry: GeoJSON.Geometry;
}

function getSectionMiddle(section: MapSection): [number, number] {
  const [pLng, pLat] = section.putIn.coordinates;
  const [tLng, tLat] = section.takeOut.coordinates;
  return [(pLng + tLng) / 2, (pLat + tLat) / 2];
}

function getFeature(
  e: GeoJSON.Feature | OnPressEvent,
): PressedFeature | null {
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
}

export const useSelectionHandler = (
  sections: MapSection[],
  pois: PointCoreFragment[],
  sectionSelectable = true,
  _visibleBounds: MutableRefObject<BBox>,
) => {
  const [, onSelected] = useMapSelection();
  const camera = useCamera();
  const onPress = useCallback(
    (e: GeoJSON.Feature | OnPressEvent) => {
      const feature = getFeature(e);
      if (!feature) {
        onSelected(null);
        return;
      }
      const { id, geometry } = feature;
      const { type } = geometry;
      const nodes: Array<MapSection | PointCoreFragment> =
        type === 'LineString' ? sections : pois;
      const node = nodes.find((el) => el.id === id);
      if (node) {
        if (node.__typename === 'Section' && !sectionSelectable) {
          return;
        }
        onSelected(node);
        if (camera) {
          if (node.__typename === 'Section') {
            camera.moveTo(getSectionMiddle(node), 300);
          } else if (node.__typename === 'Point') {
            const [lng, lat] = node.coordinates;
            camera.moveTo([lng, lat], 300);
          }
        }
      } else {
        onSelected(null);
      }
    },
    [onSelected, sections, pois, camera, sectionSelectable],
  );
  return onPress;
};
