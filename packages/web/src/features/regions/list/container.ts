import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';
import REMOVE_REGION from './removeRegion.mutation';

export default compose(
  withRegionsList,
  withDeleteMutation({
    mutation: REMOVE_REGION,
    propName: 'removeRegion',
    refetchQueries: ['listRegions'],
  }),
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
