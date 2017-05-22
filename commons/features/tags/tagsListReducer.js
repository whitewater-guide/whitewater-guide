import _ from 'lodash';
import { isMutationResult } from '../../core/apolloUtils';
import update from 'immutability-helper';

function removeTag(previousResult, { category, _id }) {
  const field = _.lowerFirst(category);
  const tags = previousResult[field];
  const result = {
    ...previousResult,
    [field]: _.reject(tags, { _id }),
  };
  console.log('After tag removed', result);
  return result;
}

function upsertTag(previousResult, category, newTag) {
  console.log('Upsert tag', category, newTag);
  const field = _.lowerFirst(category);
  const tags = previousResult[field];
  const index = _.findIndex(tags, { _id: newTag._id });
  const delCount = index === -1 ? 0 : 1;
  const spliceAt = index === -1 ? tags.length : index;
  const result = {
    ...previousResult,
    [field]: update(tags, { $splice: [[spliceAt, delCount, newTag]] }),
  };
  console.log('After tag upsert', result);
  return result;
}

export default function (previousResult, action, variables) {
  console.dir({ TAGS: 'TAGS', previousResult, action, variables });
  if (isMutationResult(action, 'removeTag') && action.result.data.removeTag === true) {
    return removeTag(previousResult, action.variables);
  } else if (isMutationResult(action, 'upsertTag')) {
    return upsertTag(previousResult, action.variables.tag.category, action.result.data.upsertTag);
  }
  return previousResult;
}
