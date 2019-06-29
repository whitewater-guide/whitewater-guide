import {
  DefaultSectionSearchTerms,
  SectionSearchTerms,
  SelectableTag,
  Tag,
  TagSelection,
} from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import { SearchState } from '../types';

export const getStateFactory = (tags: Tag[]) => (
  searchTerms: SectionSearchTerms | null,
): SearchState => {
  const { withTags, withoutTags, ...restTerms } =
    searchTerms || DefaultSectionSearchTerms;
  const selectableTags: SelectableTag[] = tags.map((tag: Tag) => {
    const selection = withTags.includes(tag.id)
      ? TagSelection.SELECTED
      : withoutTags.includes(tag.id)
      ? TagSelection.DESELECTED
      : TagSelection.NONE;
    return { ...tag, selection };
  });
  const { kayaking, hazards, supply, misc } = groupBy(
    selectableTags,
    'category',
  );
  return {
    ...restTerms,
    kayaking,
    hazards,
    supply,
    misc,
  };
};
