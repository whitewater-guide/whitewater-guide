import type { LineLayer } from '@rnmapbox/maps';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

import { useMapSelection } from '../map-selection';

export type MapboxLayerFilter = NonNullable<
  ComponentProps<typeof LineLayer>['filter']
>;

export const useMapboxSelectionFilter = (): MapboxLayerFilter => {
  const [selection] = useMapSelection();
  return useMemo(
    () =>
      ['all', ['==', '$id', selection ? selection.id : 'x']] as MapboxLayerFilter,
    [selection],
  );
};
