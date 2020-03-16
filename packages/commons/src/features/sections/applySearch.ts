import { getSectionsComparator } from './compareSections';
import { getFilter } from './filterSection';
import { Section, SectionFilterOptions } from './types';

export const applySearch = (
  sections: Section[],
  terms: SectionFilterOptions | null,
) => sections.filter(getFilter(terms)).sort(getSectionsComparator(terms));
