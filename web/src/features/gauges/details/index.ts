import { compose } from 'recompose';
import { withLoading } from '../../../components/withLoading';
import { withGauge, WithGauge } from '../../../ww-clients/features/gauges';
import GaugeDetails from './GaugeDetails';

export default compose(
  withGauge(),
  withLoading<WithGauge>(props => props.gauge.loading),
)(GaugeDetails);
