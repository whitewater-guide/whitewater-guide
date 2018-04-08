import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, Gauge } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import LIST_GAUGES from './listGauges.query';

export interface WithGaugesListResult {
  gauges: Connection<Gauge>;
}

interface WithGaugesListProps {
  sourceId?: string;
}

interface ChildProps {
  gauges: WithList<Gauge>;
}

export type WithGaugesList = WithGaugesListProps & ChildProps;

export const withGaugesList = compose(
  withFeatureIds('source'),
  graphql<WithGaugesListProps, WithGaugesListResult, WithGaugesListProps, ChildProps>(
    LIST_GAUGES,
    {
      alias: 'withGaugesList',
      options: () => ({
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }),
      props: props => queryResultToList(props, 'gauges'),
    },
  ),
);
