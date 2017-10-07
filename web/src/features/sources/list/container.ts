import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import {  } from '../../../ww-clients/features/soorces';
import REMOVE_SOURCE from './removeSource.mutation';

export default compose(
  withRegionsList,
  withDeleteMutation({
    mutation: REMOVE_SOURCE,
    propName: 'removeSource',
    refetchQueries: ['listSources'],
  }),
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
