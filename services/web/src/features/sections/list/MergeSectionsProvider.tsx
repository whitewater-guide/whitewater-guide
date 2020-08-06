import { Section } from '@whitewater-guide/commons';
import React, { useContext, useState } from 'react';

interface MergeSectionsContext {
  source: Section | null;
  setSource: (value: Section | null) => void;
}

const MergeSectionsContext = React.createContext<MergeSectionsContext>({
  source: null,
  setSource: () => {},
});

export const MergeSectionsProvider: React.FC = ({ children }) => {
  const [source, setSource] = useState<Section | null>(null);
  return (
    <MergeSectionsContext.Provider value={{ source, setSource }}>
      {children}
    </MergeSectionsContext.Provider>
  );
};

export const useMergeSource = () => useContext(MergeSectionsContext);
