import { River } from '@whitewater-guide/commons';
import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import { RIVER_DETAILS } from './riverDetails.query';

interface WithRiverOptions {
  fetchPolicy?: FetchPolicy;
}

interface Result {
  river: River;
  riverId: string;
}

interface Vars {
  riverId: string;
}

type Props = Vars;

interface ChildProps {
  river: WithNode<River>;
}

export type WithRiver = Props & ChildProps;

export const withRiver = ({
  fetchPolicy = 'cache-and-network',
}: WithRiverOptions = {}) =>
  compose<WithRiver, any>(
    withFeatureIds('river'),
    graphql<Props, Result, Vars, ChildProps>(RIVER_DETAILS, {
      alias: 'withRiver',
      options: () => ({ fetchPolicy }),
      props: (props) => queryResultToNode(props, 'river'),
    }),
  );
