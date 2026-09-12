import type { PointCoreFragment } from '@whitewater-guide/schema';
import type { PropsWithChildren } from 'react';
import { createContext, memo, useContext, useState } from 'react';

import type { MapSection, MapSelectionNode } from './types';

export type MapSelection = [
  selection: MapSection | PointCoreFragment | null,
  onSelected: (node: MapSelectionNode | null) => void,
];

export interface MapSelectionProviderProps extends PropsWithChildren {
  initialSelection?: MapSection | PointCoreFragment | null;
}

function noop(_node: MapSelectionNode | null) {
  // default context setter
}

export const MapSelectionContext = createContext<MapSelection>([null, noop]);

export const MapSelectionProvider = memo(
  ({
    children,
    initialSelection = null,
  }: MapSelectionProviderProps) => {
    const state = useState<MapSection | PointCoreFragment | null>(
      initialSelection,
    );
    return (
      <MapSelectionContext.Provider value={state}>
        {children}
      </MapSelectionContext.Provider>
    );
  },
);

MapSelectionProvider.displayName = 'MapSelectionProvider';

export const useMapSelection = () => useContext(MapSelectionContext);
