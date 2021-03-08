import { Region } from '@whitewater-guide/commons';
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
}) => {
  return (
    <AddSectionRegionContext.Provider value={region}>
      {children}
    </AddSectionRegionContext.Provider>
  );
};

export function useAddSectionRegion() {
  return useContext(AddSectionRegionContext);
}
