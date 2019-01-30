import { WithRiversList } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';

export type RiversListProps = WithRiversList &
  WithDeleteMutation<'removeRiver'> &
  RouteComponentProps<{ regionId: string }>;
