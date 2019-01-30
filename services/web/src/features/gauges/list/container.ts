import { withGaugesList, WithGaugesList } from '@whitewater-guide/clients';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import REMOVE_GAUGE from './removeGauge.mutation';
import { GaugesListInnerProps, GaugesListOuterProps } from './types';
import withToggleGauge from './withToggleGauge';

export default compose<GaugesListInnerProps, GaugesListOuterProps>(
  withRouter,
  withGaugesList,
  withDeleteMutation({
    mutation: REMOVE_GAUGE,
    propName: 'removeGauge',
    refetchQueries: ['listGauges'],
  }),
  withToggleGauge,
  withLoading<WithGaugesList>(({ gauges }) => gauges.loading),
);
