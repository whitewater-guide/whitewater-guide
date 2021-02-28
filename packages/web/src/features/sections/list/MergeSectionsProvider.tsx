import { Section } from '@whitewater-guide/commons';
import noop from 'lodash/noop';
import React, { useContext, useState } from 'react';

interface MergeSectionsContext {
  source: Section | null;
  setSource: (value: Section | null) => void;
}

const MergeSectionsCtx = React.createContext<MergeSectionsContext>({
  source: null,
  setSource: noop,
});

export const MergeSectionsProvider: React.FC = ({ children }) => {
  const [source, setSource] = useState<Section | null>(null);
  return (
    <MergeSectionsCtx.Provider value={{ source, setSource }}>
      {children}
    </MergeSectionsCtx.Provider>
  );
};

export const useMergeSource = () => useContext(MergeSectionsCtx);
