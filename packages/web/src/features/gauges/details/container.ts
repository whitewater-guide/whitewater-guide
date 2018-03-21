import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { WithGauge, withGauge } from '../../../ww-clients/features/gauges';
import { GaugeDetailsProps } from './types';

export default compose<GaugeDetailsProps, {}>(
  withGauge(),
  withLoading<WithGauge>(props => props.gauge.loading),
);
