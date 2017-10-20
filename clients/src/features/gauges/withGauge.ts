import { ApolloQueryResult, FetchPolicy, graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Gauge } from '../../../ww-commons';
import { withFeatureIds } from '../../core';
import GAUGE_DETAILS from './gaugeDetails.query';

interface WithGaugeOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithGaugeResult {
  gauge: Gauge;
}

interface WithGaugeProps {
  gaugeId: string;
}

export interface WithGauge {
  gaugeId: string;
  gauge: Gauge;
  gaugeLoading: boolean;
  gaugeRefetch: (variables?: WithGaugeProps) => Promise<ApolloQueryResult<WithGaugeResult>>;
}

export const withGauge = ({ fetchPolicy = 'cache-and-network' }: WithGaugeOptions) =>
  compose<WithGauge, any>(
    withFeatureIds('gauge'),
    graphql<WithGaugeResult, WithGaugeProps, WithGauge>(
      GAUGE_DETAILS,
      {
        alias: 'withGauge',
        options: { fetchPolicy },
        props: ({ data, ownProps }) => ({
          gaugeId: ownProps.gaugeId,
          gauge: data!.gauge,
          gaugeLoading: data!.loading,
          gaugeRefetch: data!.refetch,
        }),
      },
    ),
  );
