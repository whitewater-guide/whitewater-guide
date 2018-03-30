import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withLanguage } from '../../../components/forms';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';
import REMOVE_REGION from './removeRegion.mutation';

export default compose(
  withLanguage,
  withRegionsList,
  withDeleteMutation({
    mutation: REMOVE_REGION,
    propName: 'removeRegion',
    refetchQueries: ['listRegions'],
  }),
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
