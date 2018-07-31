import { flow, groupBy, omit } from 'lodash/fp';
import { deserializeForm } from '../../../components/forms';

export default (input?: object | null) => {
  const result = deserializeForm(['description'], ['river', 'gauge', 'pois', 'tags'])(input) as any;
  if (!result) {
    return result;
  }
  const { flows, levels, tags, demo, ...rest } = result;
  const {
    kayaking: kayakingTags = [],
    hazards: hazardsTags = [],
    supply: supplyTags = [],
    misc: miscTags = [],
  } = flow(omit(['__typename']), groupBy('category'))(tags);
  return {
    ...rest,
    kayakingTags,
    hazardsTags,
    supplyTags,
    miscTags,
    flows: flows ? omit(['__typename'], flows) : null,
    levels: levels ? omit(['__typename'], levels) : null,
  };
};
