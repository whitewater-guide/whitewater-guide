import { compose, mapProps, pure } from 'recompose';
import { chunkedListLoader } from '../../ww-clients/apollo';
import { withFeatureIds } from '../../ww-clients/core';
import { consumeRegion } from '../../ww-clients/features/regions';
import { withSectionsList } from '../../ww-clients/features/sections';
import { applySearch } from '../../ww-commons';
import { InnerProps, OuterProps } from './types';

export default compose<InnerProps & OuterProps, OuterProps>(
  consumeRegion(({ region, searchTerms}) => ({ region, searchTerms})),
  withFeatureIds('region'),
  withSectionsList(),
  chunkedListLoader('sections'),
  mapProps(({ sections, searchTerms, selectRegion, navigation, region }) => ({
    region,
    sections: {
      ...sections,
      nodes: applySearch(sections.nodes, searchTerms),
    },
    selectRegion,
    navigation,
  })),
  pure,
);
