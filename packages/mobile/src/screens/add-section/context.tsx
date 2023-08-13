import { RegionDetailsFragment } from '@whitewater-guide/clients';
import React, { FC, PropsWithChildren, useContext } from 'react';

const AddSectionRegionContext = React.createContext<
  RegionDetailsFragment | null | undefined
>(undefined);

interface Props {
  region?: RegionDetailsFragment | null;
}

export const AddSectionRegionProvider: FC<PropsWithChildren<Props>> = ({
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
