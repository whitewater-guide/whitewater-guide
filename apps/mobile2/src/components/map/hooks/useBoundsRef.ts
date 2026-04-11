import type { BBox } from '@whitewater-guide/clients';
import { getBBox } from '@whitewater-guide/clients';
import type { MutableRefObject } from 'react';
import { useCallback, useRef } from 'react';

type UseBoundsRef = [MutableRefObject<BBox>, (e: any) => void];

export const useBoundsRef = (
  initialBounds: CodegenCoordinates[],
): UseBoundsRef => {
  const visibleBounds = useRef<BBox | null>(null);

  if (!visibleBounds.current) {
    visibleBounds.current = getBBox(initialBounds);
  }

  const onRegionDidChange = useCallback((e: any) => {
    const vb = e?.properties?.visibleBounds;
    if (vb) {
      visibleBounds.current = vb as BBox;
    }
  }, []);

  return [visibleBounds as MutableRefObject<BBox>, onRegionDidChange];
};
