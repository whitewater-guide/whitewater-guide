import { Action, isType } from 'typescript-fsa';
import { DefaultSectionSearchTerms } from '../../sections/types';
import { resetSearchTerms, selectBounds, selectPOI, selectSection, updateSearchTerms } from '../actions';
import { RegionState } from './types';

const initialState: RegionState = {
  selectedBounds: null,
  selectedSectionId: null,
  selectedPOIId: null,
  searchTerms: { ...DefaultSectionSearchTerms },
};

export default (state = initialState, action: Action<any>) => {
  if (isType(action, updateSearchTerms)) {
    return { ...state, searchTerms: { ...state.searchTerms, ...action.payload.searchTerms } };
  }
  if (isType(action, resetSearchTerms)) {
    return { ...state, searchTerms: { ...DefaultSectionSearchTerms } };
  }
  if (isType(action, selectSection)) {
    const section = action.payload.section;
    return { ...state, selectedSectionId: section ? section.id : null };
  }
  if (isType(action, selectPOI)) {
    const poi = action.payload.poi;
    return { ...state, selectedPOIId: poi ? poi.id : null };
  }
  if (isType(action, selectBounds)) {
    return { ...state, selectedBounds: action.payload.bounds };
  }
  return state;
};
