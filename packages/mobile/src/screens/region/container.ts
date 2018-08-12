import { compose, mapProps, pure } from 'recompose';
import { chunkedListLoader } from '../../ww-clients/apollo';
import { withFeatureIds } from '../../ww-clients/core';
import { withSectionsList, WithSectionsList } from '../../ww-clients/features/sections';
import { applySearch } from '../../ww-commons';
import { InnerProps, OuterProps } from './types';

type MappedProps = OuterProps & WithSectionsList;

export default compose<InnerProps & OuterProps, OuterProps>(
  withFeatureIds('region'),
  withSectionsList({ fetchPolicy: 'cache-first' }),
  chunkedListLoader('sections'),
  mapProps(({ sections, searchTerms, navigation, region }: MappedProps) => ({
    region,
    sections: {
      ...sections,
      nodes: applySearch(sections.nodes, searchTerms),
    },
    navigation,
  })),
  pure,
);
