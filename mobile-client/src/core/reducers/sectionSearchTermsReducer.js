import { NavigationActions } from 'react-navigation';
import { isNull } from 'lodash';
import update from 'immutability-helper';
import { defaultSectionSearchTerms } from '../../commons/domain';
import { UPDATE_SECTION_SEARCH_TERMS } from '../actions/ActionTypes';

const initialState = {
  currentRegion: 'all',
};

export default (state = initialState, action) => {
  const { type, payload, routeName, params } = action;
  switch (type) {
    case UPDATE_SECTION_SEARCH_TERMS:
      return update(state, { [state.currentRegion]: { $merge: payload } });
    case NavigationActions.NAVIGATE: {
      if (routeName === 'RegionDetails' || routeName === 'AllSectionsRoot') {
        // Set default search terms when navigating for the first time
        const regionId = params && params.regionId;
        const currentRegion = regionId || 'all';
        const currentSearchTerms = state[currentRegion] || { ...defaultSectionSearchTerms, regionId };
        return {
          ...state,
          currentRegion,
          [currentRegion]: { ...currentSearchTerms },
        };
      }
      return state;
    }
    default:
      return state;
  }
};
