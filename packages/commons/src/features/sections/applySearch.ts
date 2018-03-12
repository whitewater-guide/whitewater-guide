import { getSectionsComparator } from './compareSections';
import { getFilter } from './filterSection';
import { Section, SectionSearchTerms } from './types';

export const applySearch = (sections: Section[], terms: SectionSearchTerms) =>
  sections.filter(getFilter(terms)).sort(getSectionsComparator(terms));
