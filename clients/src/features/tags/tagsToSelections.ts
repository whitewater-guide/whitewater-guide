import { mapValues, pick } from 'lodash';
import { map } from 'lodash/fp';
import { Tag, WithSelectableTags, WithTags } from '../../ww-commons';

export const tagsToSelections = <Props extends WithTags>(tags: Props): WithSelectableTags =>
  mapValues(
    pick(tags, ['kayakingTags', 'hazardsTags', 'miscTags', 'supplyTags']),
    map((tag: Tag) => ({ ...tag, selection: 'none' })),
) as any;
