// @ts-ignore
import * as deburr from 'lodash/deburr';
import { Section, SectionSearchTerms, SectionSortBy } from './types';

// sortBy: 'name' | 'difficulty' | 'duration' | 'rating';
// sortDirection: 'ASC' | 'DESC';

const fullName = ({ river, name }: Section) => deburr(`${river.name}${name}`.toLowerCase());

export type SectionComparator = (a: Section, b: Section) => number;

const comparators: {[key in SectionSortBy]: SectionComparator} = {
  name: (a: Section, b: Section) => fullName(a).localeCompare(fullName(b)),
  difficulty: (a: Section, b: Section) => a.difficulty - b.difficulty,
  duration: ({ duration: a }: Section, { duration: b }: Section) => (a || 0) - (b || 0),
  rating: ({ rating: a }: Section, { rating: b }: Section) => (a || 0) - (b || 0),
};

export const getSectionsComparator = (terms: SectionSearchTerms): SectionComparator => {
  const comparator = comparators[terms.sortBy];
  const x = terms.sortDirection.toLowerCase() === 'asc' ? 1 : -1;
  return (a: Section, b: Section) => x * comparator(a, b);
};