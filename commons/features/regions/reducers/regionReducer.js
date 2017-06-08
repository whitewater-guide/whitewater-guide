import { UPDATE_REGION, RESET_SEARCH_TERMS } from '../actions';
import { defaultSectionSearchTerms } from '../../../domain';

const initialState = {
  selectedBounds: null,
  selectedSectionId: null,
  selectedPOIId: null,
  searchTerms: { ...defaultSectionSearchTerms },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_REGION:
      return { ...state, ...payload.data };// Shallow merge
    case RESET_SEARCH_TERMS:
      return { ...state, searchTerms: { ...defaultSectionSearchTerms } };
    default:
      return state;
  }
};
