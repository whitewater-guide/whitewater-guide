import { DefaultSectionFilterOptions } from '@whitewater-guide/commons';
import { useContext } from 'react';

import { createGenericFilter } from '../../utils';

const SF = createGenericFilter(DefaultSectionFilterOptions);

export const SectionsFilterOptionsContext = SF.FilterContext;
export const SectionsFilterOptionsSetterContext = SF.FilterSetterContext;
export const SectionsSearchStringContext = SF.SearchContext;
export const SectionsSearchStringSetterContext = SF.SearchSetterContext;

export const SectionsFilterProvider = SF.Provider;

export const useSectionsFilterOptions = () =>
  useContext(SectionsFilterOptionsContext);
export const useSectionsSearchString = () =>
  useContext(SectionsSearchStringContext);
export const useSectionsFilterOptionsSetter = () =>
  useContext(SectionsFilterOptionsSetterContext);
export const useSectionsSearchStringSetter = () =>
  useContext(SectionsSearchStringSetterContext);
