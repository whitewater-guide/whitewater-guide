import { SectionSearchTerms, TagSelection } from '@whitewater-guide/commons';
import { SearchState } from '../types';

type Acc = Pick<SectionSearchTerms, 'withTags' | 'withoutTags'>;

export const stateToSearchTerms = (state: SearchState): SectionSearchTerms => {
  const { kayaking, hazards, supply, misc, ...restTerms } = state;
  const allTags = [...kayaking, ...hazards, ...supply, ...misc];
  const tagIds: Acc = allTags.reduce(
    (acc: Acc, tag) => {
      if (tag.selection === TagSelection.SELECTED) {
        acc.withTags.push(tag.id);
      } else if (tag.selection === TagSelection.DESELECTED) {
        acc.withoutTags.push(tag.id);
      }
      return acc;
    },
    { withTags: [], withoutTags: [] },
  );
  return { ...restTerms, ...tagIds };
};
