import { Region } from '@whitewater-guide/schema';
import React, { useContext } from 'react';

const AddSectionRegionContext = React.createContext<Region | null | undefined>(
  undefined,
);

interface Props {
  region?: Region | null;
}

export const AddSectionRegionProvider: React.FC<Props> = ({
  region,
  children,
}) => (
  <AddSectionRegionContext.Provider value={region}>
    {children}
  </AddSectionRegionContext.Provider>
);

export function useAddSectionRegion() {
  return useContext(AddSectionRegionContext);
}
