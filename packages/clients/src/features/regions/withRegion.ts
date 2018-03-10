import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Region } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { REGION_DETAILS } from './regionDetails.query';

interface WithRegionOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithRegionResult {
  region: Region;
  regionId: string;
}

interface WithRegionProps {
  regionId: string;
}

export interface WithRegion {
  region: WithNode<Region>;
  regionId: string;
}

export const withRegion = ({ fetchPolicy = 'cache-and-network' }: WithRegionOptions = {}) =>
  compose<WithRegion, any>(
    withFeatureIds('region'),
    graphql<WithRegionResult, WithRegionProps, WithRegion>(
      REGION_DETAILS,
      {
        alias: 'withRegion',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'region'),
      },
    ),
  );
