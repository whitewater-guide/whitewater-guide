import { defaultSectionSearchTerms } from '../../../domain';
import regionSettingsSelector from './regionSettingsSelector';

export default (state, props) => {
  const { regionId } = props;
  const region = regionSettingsSelector(state, props);
  let searchTerms = region && region.searchTerms;
  if (!searchTerms) {
    searchTerms = { ...defaultSectionSearchTerms, regionId };
  }
  return { searchTerms };
};
