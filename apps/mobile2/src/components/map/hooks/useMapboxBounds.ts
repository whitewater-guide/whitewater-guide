import { getBBox } from '@whitewater-guide/clients';
import { useMemo } from 'react';

import theme from '../../../theme';

interface MapboxBounds {
  ne: [number, number];
  sw: [number, number];
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
}

interface Result {
  defaultSettings: { bounds: MapboxBounds };
}

export const useMapboxBounds = (initialBounds: CodegenCoordinates[]): Result =>
  useMemo(() => {
    const [ne, sw] = getBBox(initialBounds);
    const bounds: MapboxBounds = {
      ne,
      sw,
      paddingBottom: theme.margin.single,
      paddingLeft: theme.margin.single,
      paddingRight: theme.margin.single,
      paddingTop: theme.margin.single,
    };
    return { defaultSettings: { bounds } };
  }, [initialBounds]);
