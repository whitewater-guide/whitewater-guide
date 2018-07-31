import { withNetworkConnectivity } from 'react-native-offline';
import { compose, mapProps, pure } from 'recompose';
import { chunkedListLoader } from '../../ww-clients/apollo';
import { withFeatureIds } from '../../ww-clients/core';
import { withSectionsList, WithSectionsList } from '../../ww-clients/features/sections';
import { applySearch } from '../../ww-commons';
import { InnerProps, OuterProps } from './types';

type MappedProps = OuterProps & WithSectionsList;

interface ConnectivityProps {
  isConnected: boolean;
}

export default compose<InnerProps & OuterProps, OuterProps>(
  withFeatureIds('region'),
  withNetworkConnectivity(),
  withSectionsList(
    ({ isConnected }: ConnectivityProps) => ({ fetchPolicy: isConnected ? 'cache-first' : 'cache-only' }),
  ),
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
