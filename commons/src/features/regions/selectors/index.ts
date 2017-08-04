import { createSelector } from 'reselect';
import { defaultSectionSearchTerms } from '../../../domain';

const regionIdFromProps = (_, props) => props.regionId;
const regionsSelector = state => state.persistent.regions;

export const searchTermsSelector = createSelector(
  regionsSelector,
  regionIdFromProps,
  (regions, regionId) => {
    const region = regions[regionId || 'all'];
    return { searchTerms: (region && region.searchTerms) || defaultSectionSearchTerms };
  },
);

