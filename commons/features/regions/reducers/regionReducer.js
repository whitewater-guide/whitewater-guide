import { merge } from 'lodash';
import { UPDATE_REGION } from '../actions';
import { defaultSectionSearchTerms } from '../../../domain';

export default (regionId) => {
  const initialState = {
    selectedBounds: null,
    selectedSectionId: null,
    selectedPOIId: null,
    searchTerms: { ...defaultSectionSearchTerms, regionId },
  };

  return (state = initialState, { type, payload }) => {
    switch (type) {
      case UPDATE_REGION:
        return merge({}, state, payload.data);
      default:
        return state;
    }
  };
};
