import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, River } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import { LIST_RIVERS } from './listRivers.query';

export interface WithRiversListOptions {
  fetchPolicy?: FetchPolicy;
}

export interface WithRiversListResult {
  rivers: Connection<River>;
}

export interface WithRiversList {
  rivers: WithList<River>;
  regionId?: string;
}

export const withRiversList = ({ fetchPolicy = 'cache-and-network' }: WithRiversListOptions = {}) =>
  compose(
    withFeatureIds('region'),
    graphql<WithRiversListResult, any, WithRiversList>(
      LIST_RIVERS,
      {
        alias: 'withRiversList',
        options: (props) => ({
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
          variables: {
            language: props.langauge,
            filter: { regionId: props.regionId },
            // page ?
          },
        }),
        props: props => queryResultToList(props, 'rivers'),
      },
    ),
  );
