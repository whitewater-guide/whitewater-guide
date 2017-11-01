import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithGaugesList } from '../../../ww-clients/features/gauges';
import { WithToggleGauge } from './withToggleGauge';

export type GaugesListProps =
  WithGaugesList &
  WithDeleteMutation<'removeGauge'> &
  WithToggleGauge &
  RouteComponentProps<{sourceId: string}>;
