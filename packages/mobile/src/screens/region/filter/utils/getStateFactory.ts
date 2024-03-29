import type { SectionFilterOptions } from '@whitewater-guide/clients';
import { DefaultSectionFilterOptions } from '@whitewater-guide/clients';
import type { Tag } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';

import type { SelectableTag } from '~/features/tags';
import { TagSelection } from '~/features/tags';

import type { SearchState } from '../types';

export const getStateFactory =
  (tags: Tag[]) =>
  (filterOptions: SectionFilterOptions | null): SearchState => {
    const { withTags, withoutTags, ...restTerms } =
      filterOptions || DefaultSectionFilterOptions;
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
