import { Point, Section } from '@whitewater-guide/commons';
import React from 'react';

export interface MapSelection {
  selection: Section | Point | null;
  onSelected: (node: Section | Point | null) => void;
}

export const MapSelectionContext = React.createContext<MapSelection>({
  selection: null,
  onSelected: () => {},
});

export const MapSelectionProvider: React.FC = React.memo(({ children }) => {
  const [selection, onSelected] = React.useState<Section | Point | null>(null);
  return (
    <MapSelectionContext.Provider value={{ selection, onSelected }}>
      {children}
    </MapSelectionContext.Provider>
  );
});

MapSelectionProvider.displayName = 'MapSelectionProvider';

export const useMapSelection = () => React.useContext(MapSelectionContext);
