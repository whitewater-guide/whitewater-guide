import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withGaugesList, WithGaugesList } from '../../../ww-clients/features/gauges';
import REMOVE_GAUGE from './removeGauge.mutation';

export default compose(
  withRouter,
  withGaugesList,
  withDeleteMutation({
    mutation: REMOVE_GAUGE,
    propName: 'removeGauge',
    refetchQueries: ['listGauges'],
  }),
  withLoading<WithGaugesList>(({ gauges }) => gauges.loading),
);
