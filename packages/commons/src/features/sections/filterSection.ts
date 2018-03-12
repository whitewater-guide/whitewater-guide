import { Section, SectionSearchTerms } from './types';

export const getFilter = (terms: SectionSearchTerms) => (section: Section): boolean => {
  const {
    searchString,
    difficulty,
    duration,
    rating,
    seasonNumeric,
    withTags,
    withoutTags,
  } = terms;

  const allNames = [
    section.river.name,
    ...(section.river.altNames || []),
    section.name,
    ...(section.altNames || []),
  ].map(s => s.toLowerCase());
  if (searchString && !allNames.some(n => n.toLowerCase().includes(searchString))) {
    return false;
  }
  if (section.difficulty > difficulty[1] || section.difficulty < difficulty[0]) {
    return false;
  }
  if (section.duration && (section.duration > duration[1] || section.duration < duration[0])) {
    return false;
  }
  if (section.rating !== null && section.rating < rating) {
    return false;
  }
  // seasonNumeric
  // withTags
  // withoutTags
  return true;
};
