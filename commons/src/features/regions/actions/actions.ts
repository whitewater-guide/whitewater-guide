import { createAction } from 'redux-actions';
import { SELECT_REGION, UPDATE_REGION, RESET_SEARCH_TERMS } from './ActionTypes';

export const selectRegion = createAction(SELECT_REGION, regionId => ({ regionId }));

const updateRegion = createAction(UPDATE_REGION, (regionId, data) => ({ regionId, data }));

export const updateSearchTerms = (regionId, searchTerms) => updateRegion(regionId, { searchTerms });

export const selectSection = (regionId, section) => updateRegion(
  regionId,
  { selectedSectionId: section && section._id, selectedPOIId: null },
);

export const selectPOI = (regionId, poi) => updateRegion(
  regionId,
  { selectedSectionId: null, selectedPOIId: poi && poi._id },
);

export const selectBounds = (regionId, bounds) => updateRegion(regionId, { selectedBounds: bounds });

export const resetSearchTerms = createAction(RESET_SEARCH_TERMS, regionId => ({ regionId }));
