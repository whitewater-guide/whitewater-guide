import { DefaultRegionFilterOptions } from '@whitewater-guide/commons';
import { useContext } from 'react';

import { createGenericFilter } from '../../utils';

const SF = createGenericFilter(DefaultRegionFilterOptions);

export const RegionsFilterOptionsContext = SF.FilterContext;
export const RegionsFilterOptionsSetterContext = SF.FilterSetterContext;
export const RegionsSearchStringContext = SF.SearchContext;
export const RegionsSearchStringSetterContext = SF.SearchSetterContext;

export const RegionsFilterProvider = SF.Provider;

export const useRegionsFilterOptions = () =>
  useContext(RegionsFilterOptionsContext);
export const useRegionsSearchString = () =>
  useContext(RegionsSearchStringContext);
export const useRegionsFilterOptionsSetter = () =>
  useContext(RegionsFilterOptionsSetterContext);
export const useRegionsSearchStringSetter = () =>
  useContext(RegionsSearchStringSetterContext);
