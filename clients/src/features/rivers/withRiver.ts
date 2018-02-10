import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { River } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { RIVER_DETAILS } from './riverDetails.query';

interface WithRiverOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithRiverResult {
  river: River;
  riverId: string;
}

interface WithRiverProps {
  riverId: string;
}

export interface WithRiver {
  river: WithNode<River>;
  riverId: string;
}

export const withRiver = ({ fetchPolicy = 'cache-and-network' }: WithRiverOptions = {}) =>
  compose<WithRiver, any>(
    withFeatureIds('river'),
    graphql<WithRiverResult, WithRiverProps, WithRiver>(
      RIVER_DETAILS,
      {
        alias: 'withRiver',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'river'),
      },
    ),
  );
