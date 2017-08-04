import _ from 'lodash';
import { isMutationResult } from '../../core/apolloUtils';
import update from 'immutability-helper';

function removeSection(previousResult, _id) {
  const { sections: { sections, count } } = previousResult;
  return {
    ...previousResult,
    sections: {
      sections: _.reject(sections, { _id }),
      count: count - 1,
    },
  };
}

function upsertSection(previousResult, newSection) {
  const { sections: { sections, count } } = previousResult;
  const index = _.findIndex(sections, { _id: newSection._id });
  const delCount = index === -1 ? 0 : 1;
  const spliceAt = index === -1 ? sections.length : index;
  return {
    ...previousResult,
    sections: {
      sections: update(sections, { $splice: [[spliceAt, delCount, newSection]] }),
      count: count + (index === -1 ? 1 : 0),
    },
  };
}

export default function (previousResult, action, variables) {
  // console.dir({ SECTION_REDUCER: 'SECTION_REDUCER', previousResult, action, variables });
  if (isMutationResult(action, 'removeSection') && action.result.data.removeSection === true) {
    return removeSection(previousResult, action.variables._id);
  } else if (isMutationResult(action, 'upsertSection')) {
    return upsertSection(previousResult, action.result.data.upsertSection);
  }
  return previousResult;
}
