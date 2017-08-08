import { Action } from 'typescript-fsa';
import { resetSearchTerms, selectBounds, selectPOI, selectRegion, selectSection, updateSearchTerms } from '../actions';
import regionReducer from './regionReducer';
import { RegionsState } from './types';

export const regionsReducer = (state: RegionsState = {}, action: Action<any>) => {
  const { type, payload } = action;
  switch (type) {
    case selectRegion.type:
    case updateSearchTerms.type:
    case resetSearchTerms.type:
    case selectSection.type:
    case selectPOI.type:
    case selectBounds.type: {
      const regionId = payload ? payload.regionId : null;
      const key = regionId || 'all';
      return { ...state, [key]: regionReducer(state[key], action) };
    }
    default:
      return state;
  }
};
