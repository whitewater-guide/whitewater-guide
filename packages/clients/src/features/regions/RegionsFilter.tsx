import { RegionsFilter } from '@whitewater-guide/commons';
import React, { useContext, useState } from 'react';

type FilterState = RegionsFilter | null;
type FilterSetter = (state: RegionsFilter) => void;
export interface WithRegionsFilter {
  filter: FilterState;
}
export interface WithRegionsFilterSetter {
  setFilter: FilterSetter;
}

const FilterStateContext = React.createContext<FilterState>(null);
const FilterSetterContext = React.createContext<FilterSetter>(() => {});

export const RegionsFilterProvider: React.FC = React.memo(({ children }) => {
  const [filter, setFilter] = useState<FilterState>(null);
  return (
    <FilterSetterContext.Provider value={setFilter}>
      <FilterStateContext.Provider value={filter}>
        {children}
      </FilterStateContext.Provider>
    </FilterSetterContext.Provider>
  );
});

RegionsFilterProvider.displayName = 'RegionsFilterProvider';

export const useRegionsFilterState = () => useContext(FilterStateContext);
export const useRegionsFilterSetter = () => useContext(FilterSetterContext);
