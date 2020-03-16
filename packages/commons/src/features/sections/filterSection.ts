import deburr from 'lodash/deburr';
import { Section, SectionFilterOptions } from './types';

export const getFilter = (terms: SectionFilterOptions | null) => (
  section: Section,
): boolean => {
  if (!terms) {
    return true;
  }
  const {
    searchString = '',
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
  ].map((s) => deburr(s.toLowerCase()));

  const normalizedSearch = searchString && deburr(searchString.toLowerCase());
  if (searchString && !allNames.some((n) => n.includes(normalizedSearch))) {
    return false;
  }
  if (
    section.difficulty > difficulty[1] ||
    section.difficulty < difficulty[0]
  ) {
    return false;
  }
  if (
    section.duration &&
    (section.duration > duration[1] || section.duration < duration[0])
  ) {
    return false;
  }
  if (!!section.rating && section.rating < rating) {
    return false;
  }
  if (withTags && withTags.length) {
    const someTagsMissing = withTags.some(
      (id) => !section.tags.find((st) => st.id === id),
    );
    if (someTagsMissing) {
      return false;
    }
  }
  if (withoutTags && withoutTags.length) {
    const hasBadTag = withoutTags.some(
      (id) => !!section.tags.find((st) => st.id === id),
    );
    if (hasBadTag) {
      return false;
    }
  }
  // seasonNumeric
  if (seasonNumeric && seasonNumeric.length && section.seasonNumeric.length) {
    const [from, to] = seasonNumeric;
    let firstRange = [from, to];
    let secondRange = [100, 100]; // Make sure nothing gets in this range
    if (to < from) {
      firstRange = [0, to];
      secondRange = [from, 23];
    }
    const isInRange =
      section.seasonNumeric &&
      section.seasonNumeric.some(
        (m) =>
          (m >= firstRange[0] && m <= firstRange[1]) ||
          (m >= secondRange[0] && m <= secondRange[1]),
      );
    if (!isInRange) {
      return false;
    }
  }
  return true;
};
