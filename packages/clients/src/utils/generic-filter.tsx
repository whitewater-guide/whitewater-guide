import noop from 'lodash/noop';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useState } from 'react';

interface SearchableFilterOptions {
  searchString?: string | null;
}

export function createGenericFilter<T extends SearchableFilterOptions>(
  defaultValue: T,
) {
  const FilterContext = React.createContext(defaultValue);
  const FilterSetterContext = React.createContext<(v: T) => void>(noop);
  const SearchContext = React.createContext('');
  const SearchSetterContext = React.createContext<(v: string) => void>(noop);

  const Provider = ({ children }: PropsWithChildren) => {
    const [filterOptions, setFilterOptions] = useState<T>(defaultValue);

    const setSearchString = useCallback(
      (searchString: string) => {
        setFilterOptions((terms) => ({ ...terms, searchString }));
      },
      [setFilterOptions],
    );

    return (
      <FilterSetterContext.Provider value={setFilterOptions}>
        <SearchSetterContext.Provider value={setSearchString}>
          <SearchContext.Provider value={filterOptions.searchString || ''}>
            <FilterContext.Provider value={filterOptions}>
              {children}
            </FilterContext.Provider>
          </SearchContext.Provider>
        </SearchSetterContext.Provider>
      </FilterSetterContext.Provider>
    );
  };

  return {
    FilterContext,
    FilterSetterContext,
    SearchContext,
    SearchSetterContext,
    Provider,
  };
}
