import { defaultSectionSearchTerms } from '../../../domain';

export default (state, { regionId }) => {
  const region = state.persistent.regions[regionId || 'all'];
  let searchTerms = region && region.searchTerms;
  if (!searchTerms) {
    searchTerms = { ...defaultSectionSearchTerms, regionId };
  }
  return { searchTerms };
};
