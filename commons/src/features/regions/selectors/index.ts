import { createSelector } from 'reselect';
import { DefaultSectionSearchTerms } from '../../sections/types';

const regionIdFromProps = (_: any, props: any) => props.regionId;
const regionsSelector = (state: any) => state.persistent.regions;

export const searchTermsSelector = createSelector(
  regionsSelector,
  regionIdFromProps,
  (regions, regionId) => {
    const region = regions[regionId || 'all'];
    return { searchTerms: (region && region.searchTerms) || DefaultSectionSearchTerms };
  },
);
