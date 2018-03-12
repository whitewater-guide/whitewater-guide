import { createSelector } from 'reselect';
import { DefaultSectionSearchTerms, SectionSearchTerms } from '../../../../ww-commons';

const regionIdFromProps = (_: any, props: any) => props.regionId;
const regionsSelector = (state: any) => state.regions;

export const searchTermsSelector = createSelector(
  regionsSelector,
  regionIdFromProps,
  (regions, regionId) => {
    const region = regions[regionId || 'all'];
    return { searchTerms: (region && region.searchTerms) || DefaultSectionSearchTerms };
  },
);

export interface WithSearchTerms {
  searchTerms: SectionSearchTerms;
}
