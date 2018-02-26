import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithRiversList } from '../../../ww-clients/features/rivers';

export type RiversListProps =
  WithRiversList &
  WithDeleteMutation<'removeRiver'> &
  RouteComponentProps<{regionId: string}>;
