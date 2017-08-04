import _ from 'lodash';
import { isMutationResult } from '../../core/apolloUtils';

function removeSection(previousResult, _id) {
  const { river } = previousResult;
  const { sections } = river;
  return {
    ...previousResult,
    river: {
      ...river,
      sections: _.reject(sections, { _id }),
    },
  };
}

export default function (previousResult, action, variables) {
  if (isMutationResult(action, 'removeSection') && action.result.data.removeSection === true) {
    return removeSection(previousResult, action.variables._id);
  }
  return previousResult;
}
