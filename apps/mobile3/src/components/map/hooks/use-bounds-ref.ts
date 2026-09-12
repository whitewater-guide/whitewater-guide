import type { MapState } from '@rnmapbox/maps';
import type { MutableRefObject } from 'react';
import { useCallback, useRef } from 'react';

import type { Coordinates } from '@/types/coordinates';
import type { BBox } from '@/utils/geo';
import { getBBox } from '@/utils/geo';

type UseBoundsRef = [MutableRefObject<BBox>, (state: MapState) => void];

export const useBoundsRef = (initialBounds: Coordinates[]): UseBoundsRef => {
  const visibleBounds = useRef<BBox | null>(null);

  if (!visibleBounds.current) {
    visibleBounds.current = getBBox(initialBounds);
  }

  const onMapIdle = useCallback((state: MapState) => {
    const { ne, sw } = state.properties.bounds;
    if (ne && sw) {
      visibleBounds.current = [ne as [number, number], sw as [number, number]];
    }
  }, []);

  return [visibleBounds as MutableRefObject<BBox>, onMapIdle];
};
