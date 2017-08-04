import { mapValues, pick } from 'lodash';
import { map } from 'lodash/fp';

export const tagsToSelections = (tags) => mapValues(
  pick(tags, ['kayakingTags', 'hazardsTags', 'miscTags', 'supplyTags']),
  map(tag => ({ ...tag, selection: 'none' })),
);