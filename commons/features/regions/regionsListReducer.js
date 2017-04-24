import _ from 'lodash';
import { isMutationResult } from '../../core/apolloUtils';
import update from 'immutability-helper';

function removeRegion(previousResult, _id) {
  const { regions } = previousResult;
  return {
    ...previousResult,
    regions: _.reject(regions, { _id }),
  };
}

function upsertRegion(previousResult, newRegion) {
  const { regions } = previousResult;
  const index = _.findIndex(regions, { _id: newRegion._id });
  const delCount = index === -1 ? 0 : 1;
  const spliceAt = index === -1 ? regions.length : index;
  return {
    ...previousResult,
    regions: update(regions, { $splice: [[spliceAt, delCount, newRegion]] }),
  };
}

export default function regionsListReducer(previousResult, action, variables) {
  // console.dir({ SECTION_REDUCER: 'SECTION_REDUCER', previousResult, action, variables });
  if (isMutationResult(action, 'removeRegion') && action.result.data.removeRegion === true) {
    return removeRegion(previousResult, action.variables._id);
  } else if (isMutationResult(action, 'upsertRegion')) {
    return upsertRegion(previousResult, action.result.data.upsertRegion);
  }
  return previousResult;
}
