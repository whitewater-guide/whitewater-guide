import { WithDeleteMutation } from '../../../apollo';
import { WithRegionsList } from '../../../ww-clients/features/regions';

export type RegionsListProps = WithRegionsList & WithDeleteMutation<'removeRegion'>;