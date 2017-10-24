import { FetchPolicy, graphql } from 'react-apollo';
import { compose } from 'recompose';
import { Gauge } from '../../../ww-commons';
import { queryResultToNode, WithNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import GAUGE_DETAILS from './gaugeDetails.query';

interface WithGaugeOptions {
  fetchPolicy?: FetchPolicy;
}

interface WithGaugeResult {
  gauge: Gauge;
  gaugeId: string;
}

interface WithGaugeProps {
  gaugeId: string;
}

export interface WithGauge {
  gauge: WithNode<Gauge>;
  gaugeId: string;
}

export const withGauge = ({ fetchPolicy = 'cache-and-network' }: WithGaugeOptions = {}) =>
  compose<WithGauge, any>(
    withFeatureIds('gauge'),
    graphql<WithGaugeResult, WithGaugeProps, WithGauge>(
      GAUGE_DETAILS,
      {
        alias: 'withGauge',
        options: { fetchPolicy },
        props: props => queryResultToNode(props, 'gauge'),
      },
    ),
  );
