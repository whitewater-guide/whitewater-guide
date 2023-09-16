import { getSectionsComparator } from './compareSections';
import { getFilter } from './filterSection';
import type { ListedSectionFragment } from './listSections.generated';
import type { SectionFilterOptions } from './types';

export function applySearch<T extends ListedSectionFragment>(
  sections: T[],
  terms: SectionFilterOptions | null,
): T[] {
  return sections.filter(getFilter(terms)).sort(getSectionsComparator(terms));
}
