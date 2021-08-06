import deburr from 'lodash/deburr';

import { ListedSectionFragment } from './listSections.generated';
import { SectionFilterOptions } from './types';

export const getFilter =
  (terms: SectionFilterOptions | null) =>
  // eslint-disable-next-line complexity
  (section: ListedSectionFragment): boolean => {
    if (!terms) {
      return true;
    }
    const {
      difficulty,
      duration,
      rating,
      seasonNumeric,
      withTags,
      withoutTags,
    } = terms;
    const searchString = terms.searchString ?? '';

    const allNames = [
      section.river?.name,
      ...(section.river?.altNames ?? []),
      section.name,
      ...(section.altNames || []),
    ]
      .filter((s): s is string => !!s)
      .map((s) => deburr(s.toLowerCase()));

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
    if (withTags?.length) {
      const someTagsMissing = withTags.some(
        (id) => !section.tags.find((st) => st.id === id),
      );
      if (someTagsMissing) {
        return false;
      }
    }
    if (withoutTags?.length) {
      const hasBadTag = withoutTags.some(
        (id) => !!section.tags.find((st) => st.id === id),
      );
      if (hasBadTag) {
        return false;
      }
    }
    // seasonNumeric
    if (seasonNumeric?.length && section.seasonNumeric.length) {
      const [from, to] = seasonNumeric;
      let firstRange = [from, to];
      let secondRange = [100, 100]; // Make sure nothing gets in this range
      if (to < from) {
        firstRange = [0, to];
        secondRange = [from, 23];
      }
      const isInRange = section.seasonNumeric?.some(
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
