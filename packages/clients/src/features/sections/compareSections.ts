import deburr from 'lodash/deburr';

import type { ListedSectionFragment } from '.';
import type { SectionFilterOptions, SectionSortBy } from './types';
import { DefaultSectionFilterOptions } from './types';

// sortBy: 'name' | 'difficulty' | 'duration' | 'rating';
// sortDirection: 'ASC' | 'DESC';

const fullName = ({ river, name }: ListedSectionFragment) =>
  deburr(`${river?.name}${name}`.toLowerCase());

export type SectionComparator = (
  a: ListedSectionFragment,
  b: ListedSectionFragment,
) => number;

const comparators: { [key in SectionSortBy]: SectionComparator } = {
  name: (a, b) => fullName(a).localeCompare(fullName(b)),
  difficulty: (a, b) => a.difficulty - b.difficulty,
  duration: ({ duration: a }, { duration: b }) => (a || 0) - (b || 0),
  rating: ({ rating: a }, { rating: b }) => (a || 0) - (b || 0),
};

export function getSectionsComparator(
  terms: SectionFilterOptions | null,
): SectionComparator {
  const { sortBy, sortDirection } = terms || DefaultSectionFilterOptions;
  const comparator = comparators[sortBy];
  const x = sortDirection.toLowerCase() === 'asc' ? 1 : -1;
  return (a, b) => x * comparator(a, b);
}
