import _ from 'lodash';
import { isMutationResult } from '../../core/apolloUtils';

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
  return {
    ...previousResult,
    sections: {
      sections: [...sections, newSection],
      count: count + 1,
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
