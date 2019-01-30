import { WithGauge, withGauge } from '@whitewater-guide/clients';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { GaugeDetailsProps } from './types';

export default compose<GaugeDetailsProps, {}>(
  withGauge(),
  withLoading<WithGauge>((props) => props.gauge.loading),
);
