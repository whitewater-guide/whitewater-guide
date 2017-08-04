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
    case UPDATE_REGION: {
      // Merge search terms shallowly, then the rest state shallowly
      const searchTerms = payload.data.searchTerms ?
        { ...state.searchTerms, ...payload.data.searchTerms } :
        state.searchTerms;
      return { ...state, ...payload.data, searchTerms };
    }
    case RESET_SEARCH_TERMS:
      return { ...state, searchTerms: { ...defaultSectionSearchTerms } };
    default:
      return state;
  }
};
