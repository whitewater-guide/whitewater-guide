import { RegionChangeEvent } from '@react-native-mapbox-gl/maps';
import { BBox, getBBox } from '@whitewater-guide/clients';
import { Coordinate3d } from '@whitewater-guide/commons';
import { MutableRefObject, useCallback, useRef } from 'react';

type UseBoundsRef = [MutableRefObject<BBox>, ((e: RegionChangeEvent) => void)];

export const useBoundsRef = (initialBounds: Coordinate3d[]): UseBoundsRef => {
  const visibleBounds = useRef<BBox | null>(null);

  // Lazily initialize
  if (!visibleBounds.current) {
    visibleBounds.current = getBBox(initialBounds);
  }

  const onRegionDidChange = useCallback(
    (e: RegionChangeEvent) => {
      const {
        properties: { visibleBounds: vb },
      } = e;
      visibleBounds.current = vb;
    },
    [visibleBounds],
  );
  return [visibleBounds as any, onRegionDidChange];
};
