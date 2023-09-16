import type { NamedNode, RegionFilterOptions } from '@whitewater-guide/schema';
import { useContext, useMemo } from 'react';

import { createGenericFilter } from '../../utils';
import { filterRegions } from './filterRegions';

const DefaultRegionFilterOptions: RegionFilterOptions = {
  searchString: '',
};

const SF = createGenericFilter(DefaultRegionFilterOptions);

export const RegionsFilterOptionsContext = SF.FilterContext;
export const RegionsFilterOptionsSetterContext = SF.FilterSetterContext;
export const RegionsSearchStringContext = SF.SearchContext;
export const RegionsSearchStringSetterContext = SF.SearchSetterContext;

export const RegionsFilterProvider = SF.Provider;

export const useRegionsSearchString = () =>
  useContext(RegionsSearchStringContext);
export const useRegionsFilterOptionsSetter = () =>
  useContext(RegionsFilterOptionsSetterContext);
export const useRegionsSearchStringSetter = () =>
  useContext(RegionsSearchStringSetterContext);

export function useRegionsFilter<T extends NamedNode>(nodes: T[] = []): T[] {
  const filter = useContext(RegionsFilterOptionsContext);
  return useMemo(() => filterRegions(nodes, filter), [nodes, filter]);
}
