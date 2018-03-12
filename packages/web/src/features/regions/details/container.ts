import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { withLoading } from '../../../components';
import { searchTermsSelector, WithRegion, withRegion, WithSearchTerms } from '../../../ww-clients/features/regions';
import { withSectionsList, WithSectionsList } from '../../../ww-clients/features/sections';
import { applySearch } from '../../../ww-commons';
import { RegionDetailsProps } from './types';

export default compose(
  withRegion(),
  withLoading<WithRegion>(props => props.region.loading),
  withSectionsList(),
  connect<WithSearchTerms, {}, WithSectionsList>(searchTermsSelector),
  mapProps<RegionDetailsProps, RegionDetailsProps>(({ sections, searchTerms, ...props }) => ({
    ...props,
    searchTerms,
    sections: {
      ...sections,
      nodes: applySearch(sections.nodes, searchTerms),
    },
  })),
);
