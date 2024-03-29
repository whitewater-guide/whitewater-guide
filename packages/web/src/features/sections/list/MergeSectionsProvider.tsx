import type { ListedSectionFragment } from '@whitewater-guide/clients';
import noop from 'lodash/noop';
import type { FC, PropsWithChildren } from 'react';
import React, { useContext, useState } from 'react';

type MergeSectionsContext = [
  ListedSectionFragment | null,
  (value: ListedSectionFragment | null) => void,
];

const MergeSectionsCtx = React.createContext<MergeSectionsContext>([
  null,
  noop,
]);

export const MergeSectionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useState<ListedSectionFragment | null>(null);
  return (
    <MergeSectionsCtx.Provider value={state}>
      {children}
    </MergeSectionsCtx.Provider>
  );
};

export const useMergeSource = () => useContext(MergeSectionsCtx);
