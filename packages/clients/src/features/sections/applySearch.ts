import { getSectionsComparator } from './compareSections';
import { getFilter } from './filterSection';
import { ListedSectionFragment } from './listSections.generated';
import { SectionFilterOptions } from './types';

export function applySearch(
  sections: ListedSectionFragment[],
  terms: SectionFilterOptions | null,
): ListedSectionFragment[] {
  return sections.filter(getFilter(terms)).sort(getSectionsComparator(terms));
}
