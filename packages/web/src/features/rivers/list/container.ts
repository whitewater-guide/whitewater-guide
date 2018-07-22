import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { withRiversList, WithRiversList } from '../../../ww-clients/features/rivers';
import REMOVE_RIVER from './removeRiver.mutation';
import { RiversListProps } from './types';

export default compose<RiversListProps, {}>(
  withRouter,
  withRiversList(),
  withDeleteMutation({
    mutation: REMOVE_RIVER,
    propName: 'removeRiver',
    refetchQueries: ['listRivers'],
  }),
  withLoading<WithRiversList>(({ rivers }) => rivers.loading),
);
