import { useMemo } from 'react';

import { Spacing } from '@/constants/theme';
import type { Coordinates } from '@/types/coordinates';
import { getBBox } from '@/utils/geo';

export interface MapboxBounds {
  ne: [number, number];
  sw: [number, number];
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
}

export interface MapboxBoundsResult {
  defaultSettings: { bounds: MapboxBounds };
}

export const useMapboxBounds = (
  initialBounds: Coordinates[],
): MapboxBoundsResult =>
  useMemo(() => {
    const [ne, sw] = getBBox(initialBounds);
    const bounds: MapboxBounds = {
      ne,
      sw,
      paddingBottom: Spacing.two,
      paddingLeft: Spacing.two,
      paddingRight: Spacing.two,
      paddingTop: Spacing.two,
    };
    return { defaultSettings: { bounds } };
  }, [initialBounds]);
