import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Connection, Gauge } from '../../../ww-commons';
import { queryResultToList, WithList } from '../../apollo';
import { withFeatureIds } from '../../core';
import LIST_GAUGES from './listGauges.query';

export interface WithGaugesListResult {
  gauges: Connection<Gauge>;
}

export interface WithGaugesList {
  gauges: WithList<Gauge>;
  sourceId?: string;
}

export const withGaugesList = compose(
  withFeatureIds('source'),
  graphql<WithGaugesListResult, any, WithGaugesList>(
    LIST_GAUGES,
    {
      alias: 'withGaugesList',
      options: {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      },
      props: props => queryResultToList(props, 'gauges'),
    },
  ),
);
