import { WithGaugesList } from '@whitewater-guide/clients';
import { Source } from '@whitewater-guide/commons';
import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithToggleGauge } from './withToggleGauge';

export interface GaugesListOuterProps {
  source: Source;
}

export type GaugesListInnerProps = GaugesListOuterProps &
  WithGaugesList &
  WithDeleteMutation<'removeGauge'> &
  WithToggleGauge &
  RouteComponentProps<{ sourceId: string }>;
