import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithGaugesList } from '../../../ww-clients/features/gauges';
import { Source } from '../../../ww-commons';
import { WithToggleGauge } from './withToggleGauge';

export interface GaugesListOuterProps {
  source: Source;
}

export type GaugesListInnerProps =
  GaugesListOuterProps &
  WithGaugesList &
  WithDeleteMutation<'removeGauge'> &
  WithToggleGauge &
  RouteComponentProps<{sourceId: string}>;
