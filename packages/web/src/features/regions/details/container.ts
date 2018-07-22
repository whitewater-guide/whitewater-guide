import { compose, mapProps } from 'recompose';
import { chunkedListLoader } from '../../../ww-clients/apollo';
import { consumeRegion } from '../../../ww-clients/features/regions';
import { withSectionsList } from '../../../ww-clients/features/sections';
import { applySearch } from '../../../ww-commons';
import { RegionDetailsProps } from './types';

export default compose<RegionDetailsProps, {}>(
  consumeRegion(({ region, searchTerms }) => ({ region, searchTerms })),
  withSectionsList(),
  chunkedListLoader('sections'),
  mapProps<RegionDetailsProps, RegionDetailsProps>(({ sections, searchTerms, ...props }) => ({
    ...props,
    searchTerms,
    sections: {
      ...sections,
      nodes: applySearch(sections.nodes, searchTerms),
    },
  })),
);
