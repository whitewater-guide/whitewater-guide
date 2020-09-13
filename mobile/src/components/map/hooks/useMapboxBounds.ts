import { getBBox } from '@whitewater-guide/clients';
import { CoordinateLoose } from '@whitewater-guide/commons';
import { useMemo } from 'react';

import theme from '../../../theme';
import { MapboxBounds } from '../types';

interface Result {
  defaultSettings: { bounds: MapboxBounds };
}

export const useMapboxBounds = (initialBounds: CoordinateLoose[]): Result =>
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
