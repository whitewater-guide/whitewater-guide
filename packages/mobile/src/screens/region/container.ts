import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, mapProps, pure } from 'recompose';
import { withLoading } from '../../components';
import { chunkedListLoader, queryResultToNode } from '../../ww-clients/apollo';
import { withFeatureIds } from '../../ww-clients/core';
import { REGION_DETAILS, selectRegion, WithRegion } from '../../ww-clients/features/regions';
import { searchTermsSelector, WithSearchTerms } from '../../ww-clients/features/regions/selectors';
import { WithSectionsList, withSectionsList } from '../../ww-clients/features/sections';
import { applySearch } from '../../ww-commons';
import { DispatchProps, InnerProps, OuterProps } from './types';

export default compose<InnerProps & OuterProps, OuterProps>(
  withFeatureIds('region'),
  graphql(
    REGION_DETAILS,
    {
      alias: 'withSection',
      options: () => ({ fetchPolicy: 'cache-and-network' }),
      props: (props) => queryResultToNode(props, 'region'),
    },
  ),
  withLoading<WithRegion>((props) => props.region.loading),
  withSectionsList(),
  chunkedListLoader('sections'),
  connect<WithSearchTerms, DispatchProps, WithSectionsList>(
    searchTermsSelector,
    { selectRegion },
  ),
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
