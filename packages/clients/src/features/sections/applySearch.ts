import { getSectionsComparator } from './compareSections';
import { getFilter } from './filterSection';
import { ListedSectionFragment } from './listSections.generated';
import { SectionFilterOptions } from './types';

export function applySearch<T extends ListedSectionFragment>(
  sections: T[],
  terms: SectionFilterOptions | null,
): T[] {
  return sections.filter(getFilter(terms)).sort(getSectionsComparator(terms));
}
