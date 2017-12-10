import { WithDeleteMutation } from '../../../apollo';
import { WithLanguage } from '../../../components/forms';
import { WithRegionsList } from '../../../ww-clients/features/regions';

export type RegionsListProps = WithRegionsList & WithDeleteMutation<'removeRegion'> & Partial<WithLanguage>;
