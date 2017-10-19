import { compose } from 'recompose';
import { Gauge, GaugeInput } from '../../../ww-commons';
import { WithNode, withSingleNode } from '../../apollo';
import { withFeatureIds } from '../../core';
import GAUGE_DETAILS from './gaugeDetails.query';

export const NEW_GAUGE: Partial<GaugeInput> = {
  id: null,
  name: '',
  location: null,
  code: '',
  levelUnit: '',
  flowUnit: '',
  requestParams: null,
  cron: null,
  url: null,
};

export interface WithGaugeOptions {
  errorOnMissingId?: boolean;
}

export const withGauge = (options: WithGaugeOptions) => compose(
  withFeatureIds('source'),
  withSingleNode<'gauge', Gauge>({
    resourceType: 'gauge',
    alias: 'withGauge',
    query: GAUGE_DETAILS,
    newResource: (props: any) => ({
      ...NEW_GAUGE,
      source: {
        id: props.sourceId,
      },
    }),
    ...options,
  }),
);

export type WithGauge = WithNode<'gauge', Gauge>;
