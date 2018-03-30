import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, River } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import { LIST_RIVERS } from './listRivers.query';

interface Options {
  fetchPolicy?: FetchPolicy;
}

interface Result {
  rivers: Connection<River>;
}

interface Props {
  regionId: string;
  language?: string;
}

interface Vars {
  language?: string;
  filter: {
    regionId: string;
  };
}

interface ChildProps {
  rivers: WithList<River>;
}
export type WithRiversList = Props & ChildProps;

export const withRiversList = ({ fetchPolicy = 'cache-and-network' }: Options = {}) =>
  compose<WithRiversList, any>(
    withFeatureIds('region'),
    graphql<Props, Result, Vars, ChildProps>(
      LIST_RIVERS,
      {
        alias: 'withRiversList',
        options: (props) => ({
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
          variables: {
            language: props.language,
            filter: { regionId: props.regionId },
            // page ?
          },
        }),
        props: props => queryResultToList(props, 'rivers'),
      },
    ),
  );
