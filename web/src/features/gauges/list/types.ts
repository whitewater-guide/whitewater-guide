import { WithDeleteMutation } from '../../../apollo';
import { WithGaugesList } from '../../../ww-clients/features/gauges';

export type GaugesListProps = WithGaugesList & WithDeleteMutation<'removeGauge'>;
