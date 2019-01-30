import {
  chunkedListLoader,
  consumeRegion,
  withSectionsList,
} from '@whitewater-guide/clients';
import { applySearch } from '@whitewater-guide/commons';
import { compose, mapProps } from 'recompose';
import { RegionDetailsProps } from './types';

export default compose<RegionDetailsProps, {}>(
  consumeRegion(({ region, searchTerms }) => ({ region, searchTerms })),
  withSectionsList(),
  chunkedListLoader('sections'),
  mapProps<RegionDetailsProps, RegionDetailsProps>(
    ({ sections, searchTerms, ...props }) => ({
      ...props,
      searchTerms,
      sections: {
        ...sections,
        nodes: applySearch(sections.nodes, searchTerms),
      },
    }),
  ),
);
