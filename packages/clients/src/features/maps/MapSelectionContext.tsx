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

export const MapSelectionConsumer = MapSelectionContext.Consumer;

export const useMapSelection = () => React.useContext(MapSelectionContext);

export function withMapSelection<Props>(
  Component: React.ComponentType<Props & MapSelection>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => {
    const { selection, onSelected } = useMapSelection();
    return (
      <Component {...props} selection={selection} onSelected={onSelected} />
    );
  };
  Wrapper.displayName = 'withMapSelection';

  return Wrapper;
}
