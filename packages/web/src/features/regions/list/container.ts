import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';
import REMOVE_REGION from './removeRegion.mutation';
import { RegionsListProps } from './types';

export default compose<RegionsListProps, {}>(
  withRegionsList,
  withDeleteMutation({
    mutation: REMOVE_REGION,
    propName: 'removeRegion',
    refetchQueries: ['listRegions'],
  }),
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
