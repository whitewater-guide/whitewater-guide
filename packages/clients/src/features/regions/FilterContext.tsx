import { SectionSearchTerms } from '@whitewater-guide/commons';
import React, { useContext, useState } from 'react';

export type FilterState = SectionSearchTerms | null;
export type FilterSetter = (state: FilterState) => void;
export interface WithSearchTerms {
  searchTerms: FilterState;
}
export interface WithSearchTermsSetter {
  setSearchTerms: FilterSetter;
}

const FilterStateContext = React.createContext<FilterState>(null);
const FilterSetterContext = React.createContext<FilterSetter>(() => {});

export const FilterProvider: React.FC = React.memo(({ children }) => {
  const [searchTerms, setSearchTerms] = useState<FilterState>(null);
  return (
    <FilterSetterContext.Provider value={setSearchTerms}>
      <FilterStateContext.Provider value={searchTerms}>
        {children}
      </FilterStateContext.Provider>
    </FilterSetterContext.Provider>
  );
});

FilterProvider.displayName = 'FilterProvider';

export const useFilterState = () => useContext(FilterStateContext);
export const useFilterSetteer = () => useContext(FilterSetterContext);

export function withSearchTerms<Props>(
  Component: React.ComponentType<Props & WithSearchTerms>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => (
    <FilterStateContext.Consumer>
      {(searchTerms) => <Component {...props} searchTerms={searchTerms} />}
    </FilterStateContext.Consumer>
  );
  Wrapper.displayName = 'withSearchTerms';

  return Wrapper;
}

export function withSearchTermsSetter<Props>(
  Component: React.ComponentType<Props & WithSearchTermsSetter>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => (
    <FilterSetterContext.Consumer>
      {(setSearchTerms) => (
        <Component {...props} setSearchTerms={setSearchTerms} />
      )}
    </FilterSetterContext.Consumer>
  );
  Wrapper.displayName = 'withSearchTerms';

  return Wrapper;
}
