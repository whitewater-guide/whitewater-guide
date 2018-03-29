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

interface Result {
  region: Region;
}

interface Vars {
  regionId: string;
}

type Props = Vars;

interface ChildProps {
  region: WithNode<Region>;
}

export type WithRegion = Props & ChildProps;

export const withRegion = ({ fetchPolicy = 'cache-and-network' }: WithRegionOptions = {}) =>
  compose<WithRegion, any>(
    withFeatureIds('region'),
    graphql<Props, Result, Vars, ChildProps>(
      REGION_DETAILS,
      {
        alias: 'withRegion',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'region'),
      },
    ),
  );
