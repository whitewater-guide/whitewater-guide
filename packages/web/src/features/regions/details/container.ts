import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { searchTermsSelector, withRegion, WithSearchTerms } from '../../../ww-clients/features/regions';
import { withSectionsList, WithSectionsList } from '../../../ww-clients/features/sections';
import { applySearch } from '../../../ww-commons';
import { RegionDetailsProps } from './types';

export default compose(
  withRegion,
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
