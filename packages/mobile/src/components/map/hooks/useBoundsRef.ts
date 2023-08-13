import { RegionPayload } from '@rnmapbox/maps/lib/typescript/components/MapView';
import { BBox, getBBox } from '@whitewater-guide/clients';
import { MutableRefObject, useCallback, useRef } from 'react';

type UseBoundsRef = [
  MutableRefObject<BBox>,
  (e: GeoJSON.Feature<GeoJSON.Point, RegionPayload>) => void,
];

export const useBoundsRef = (
  initialBounds: CodegenCoordinates[],
): UseBoundsRef => {
  const visibleBounds = useRef<BBox | null>(null);

  // Lazily initialize
  if (!visibleBounds.current) {
    visibleBounds.current = getBBox(initialBounds);
  }

  const onRegionDidChange = useCallback(
    (e: GeoJSON.Feature<GeoJSON.Point, RegionPayload>) => {
      const {
        properties: { visibleBounds: vb },
      } = e;
      visibleBounds.current = vb as BBox;
    },
    [visibleBounds],
  );
  return [visibleBounds as any, onRegionDidChange];
};
