import { getBBox } from '@whitewater-guide/clients';
import { Coordinate3d } from '@whitewater-guide/commons';
import { useMemo } from 'react';
import theme from '../../../theme';
import { MapboxBounds } from '../types';

interface Result {
  defaultSettings: { bounds: MapboxBounds };
}

export const useMapboxBounds = (initialBounds: Coordinate3d[]): Result =>
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
    return {
      defaultSettings: { bounds },
    };
  }, [initialBounds]);
