import { Gauge } from '@whitewater-guide/commons';
import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
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

interface ChildProps {
  gauge: WithNode<Gauge>;
}

export type WithGauge = ChildProps & WithGaugeProps;

export const withGauge = ({
  fetchPolicy = 'cache-and-network',
}: WithGaugeOptions = {}) =>
  compose<WithGauge, any>(
    withFeatureIds('gauge'),
    graphql<WithGaugeProps, WithGaugeResult, WithGaugeProps, ChildProps>(
      GAUGE_DETAILS,
      {
        alias: 'withGauge',
        options: () => ({ fetchPolicy }),
        props: (props) => queryResultToNode(props, 'gauge'),
      },
    ),
  );
