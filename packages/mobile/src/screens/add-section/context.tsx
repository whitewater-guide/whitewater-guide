import { RegionDetailsFragment } from '@whitewater-guide/clients';
import React, { useContext } from 'react';

const AddSectionRegionContext = React.createContext<
  RegionDetailsFragment | null | undefined
>(undefined);

interface Props {
  region?: RegionDetailsFragment | null;
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
