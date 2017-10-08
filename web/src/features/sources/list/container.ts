import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { WithSourcesList, withSourcesList } from '../../../ww-clients/features/sources';
import REMOVE_SOURCE from './removeSource.mutation';

export default compose(
  withSourcesList,
  withDeleteMutation({
    mutation: REMOVE_SOURCE,
    propName: 'removeSource',
    refetchQueries: ['listSources'],
  }),
  withLoading<WithSourcesList>(({ sources }) => sources.loading),
);
