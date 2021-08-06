import { PointCoreFragment } from '@whitewater-guide/schema';
import noop from 'lodash/noop';
import React, { useState } from 'react';

import { ListedSectionFragment } from '../sections';

export type MapSelection = [
  selection: ListedSectionFragment | PointCoreFragment | null,
  onSelected: (node: ListedSectionFragment | PointCoreFragment | null) => void,
];

export const MapSelectionContext = React.createContext<MapSelection>([
  null,
  noop,
]);

export const MapSelectionProvider = React.memo(({ children }) => {
  const state = useState<ListedSectionFragment | PointCoreFragment | null>(
    null,
  );
  return (
    <MapSelectionContext.Provider value={state}>
      {children}
    </MapSelectionContext.Provider>
  );
});

MapSelectionProvider.displayName = 'MapSelectionProvider';

export const useMapSelection = () => React.useContext(MapSelectionContext);
